import { catchError, take, tap, map } from 'rxjs/operators'
import {
  AngularFireDatabase,
  QueryFn,
  PathReference
} from 'angularfire2/database'
import { Inject, Injectable, Optional } from '@angular/core'
import { HttpClient, HttpResponse } from '@angular/common/http'
import {
  LRU_CACHE,
  LruCache,
  attemptToGetLruCachedValue,
  attemptToCacheInLru,
  FIREBASE_USER_AUTH_TOKEN,
  getFullUrl
} from '../common/server'
import { Observable, of } from 'rxjs'
import { TransferState } from '@angular/platform-browser'
import { makeRtDbStateTransferKey } from './server.firebase.rtdb.common'
import {
  cacheInStateTransfer,
  removeHttpInterceptorCache,
  getParams
} from '../common/browser'
import { IUniversalRtdbService } from './browser.firebase.rtdb.common'

function constructFbUrl(db: AngularFireDatabase, path: string) {
  const query = db.database.ref(path)
  return `${query.toString()}.json`
}

function mapUndefined(err: any) {
  return of(undefined)
}

function mapEmptyList<T>(err: any) {
  return of([] as ReadonlyArray<T>)
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
    const cachedValue = attemptToGetLruCachedValue<T>(cacheKey, this.lru)
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

  // tslint:disable:readonly-array
  universalList<T>(path: PathReference, queryFn?: QueryFn): Observable<T[]> {
    const query =
      (queryFn && queryFn(this.afdb.database.ref(path.toString()))) ||
      this.afdb.database.ref(path.toString())
    const internalQueryParams = (query as any).queryParams_
    const paramsFromString = internalQueryParams.toRestQueryStringParameters()
    const url = `${query.toString()}.json`
    const params = getParams({ ...paramsFromString, auth: this.authToken })
    const cacheKey = getFullUrl(url, params)
    const tsKey = makeRtDbStateTransferKey(url)
    const baseObs = this.http.get<T[]>(url, { params })
    const cachedValue = attemptToGetLruCachedValue<T[]>(cacheKey, this.lru)

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
