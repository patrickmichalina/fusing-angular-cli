import { catchError, take, tap, map } from 'rxjs/operators'
import {
  AngularFireDatabase,
  QueryFn,
  PathReference
} from 'angularfire2/database'
import { Inject, Injectable, InjectionToken, Optional } from '@angular/core'
import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http'
import { LRU_CACHE, LruCache } from './server.firebase.module'
import { Observable, of } from 'rxjs'
import { IUniversalRtdbService } from './rtdb.interface'
import { createHash } from 'crypto'
import { TransferState, StateKey } from '@angular/platform-browser'
import { makeRtDbStateTransferKey } from './common'
import { makeStateKey } from '@angular/platform-browser'

export const FIREBASE_USER_AUTH_TOKEN = new InjectionToken<string>(
  'fng.fb.svr.usr.auth'
)

function sha256(data: string) {
  return createHash('sha256')
    .update(data)
    .digest('base64')
}

function constructFbUrl(db: AngularFireDatabase, path: string) {
  const query = db.database.ref(path)
  return `${query.toString()}.json`
}

function getFullUrl(base: string, params: HttpParams) {
  const stringifiedParams = params.toString()
  return stringifiedParams ? `${base}?${params.toString()}` : base
}

function getParams(fromObject = {} as any) {
  return new HttpParams({
    fromObject: Object.keys(fromObject).reduce((acc, curr) => {
      return fromObject[curr]
        ? {
            ...acc,
            [curr]: fromObject[curr]
          }
        : { ...acc }
    }, {})
  })
}

function mapUndefined(err: any) {
  return of(undefined)
}

function mapEmptyList<T>(err: any) {
  return of([] as ReadonlyArray<T>)
}

function attemptToCacheInLru(key: string, lru?: LruCache) {
  return function(response?: any) {
    lru && response && lru.set(sha256(key), response)
  }
}

function attemptToGetCachedValue<T>(key: string, lru?: LruCache) {
  return lru && lru.get<T>(sha256(key))
}

function cacheInStateTransfer<T>(ts: TransferState, key: StateKey<string>) {
  return function(val: T) {
    ts.set(key, val)
  }
}

function removeHttpInterceptorCache<T>(ts: TransferState, key: string) {
  return function(val: T) {
    ts.remove(makeStateKey<string>(`G.${key}`))
  }
}

// tslint:disable:no-this
// tslint:disable-next-line:no-class
@Injectable()
export class ServerUniversalRtDbService implements IUniversalRtdbService {
  constructor(
    private http: HttpClient,
    private afdb: AngularFireDatabase,
    private ts: TransferState,
    @Optional()
    @Inject(FIREBASE_USER_AUTH_TOKEN)
    private authToken?: string,
    @Optional()
    @Inject(LRU_CACHE)
    private lru?: LruCache
  ) {}

  universalObject<T>(path: string): Observable<T | undefined> {
    const url = constructFbUrl(this.afdb, path)
    const params = getParams({ auth: this.authToken })
    const cacheKey = getFullUrl(url, params)
    const cachedValue = attemptToGetCachedValue<T>(cacheKey, this.lru)
    const tsKey = makeRtDbStateTransferKey(url)
    const baseObs = this.http.get<HttpResponse<T>>(url, { params })

    return cachedValue
      ? of(cachedValue).pipe(tap(cacheInStateTransfer(this.ts, tsKey)))
      : baseObs.pipe(
          take(1),
          tap(removeHttpInterceptorCache(this.ts, cacheKey)),
          tap(cacheInStateTransfer(this.ts, tsKey)),
          tap(attemptToCacheInLru(cacheKey, this.lru)),
          catchError(mapUndefined)
        )
  }

  universalList<T>(
    path: PathReference,
    queryFn?: QueryFn
  ): Observable<ReadonlyArray<T>> {
    const query =
      (queryFn && queryFn(this.afdb.database.ref(path.toString()))) ||
      this.afdb.database.ref(path.toString())
    const internalQueryParams = (query as any).queryParams_
    const paramsFromString = internalQueryParams.toRestQueryStringParameters()
    const url = `${query.toString()}.json`
    const params = getParams({ ...paramsFromString, auth: this.authToken })
    const cacheKey = getFullUrl(url, params)
    const tsKey = makeRtDbStateTransferKey(url)
    const baseObs = this.http.get<ReadonlyArray<T>>(url, { params })
    const cachedValue = attemptToGetCachedValue<ReadonlyArray<T>>(
      cacheKey,
      this.lru
    )

    return cachedValue
      ? of(cachedValue).pipe(tap(cacheInStateTransfer(this.ts, tsKey)))
      : baseObs.pipe(
          take(1),
          tap(removeHttpInterceptorCache(this.ts, url)),
          map((val: any) => {
            return Array.isArray(val)
              ? val.filter(Boolean)
              : Object.keys(val).map(key => val[key])
          }),
          tap(cacheInStateTransfer(this.ts, tsKey)),
          tap(attemptToCacheInLru(cacheKey, this.lru)),

          catchError(mapEmptyList)
        )
  }
}
