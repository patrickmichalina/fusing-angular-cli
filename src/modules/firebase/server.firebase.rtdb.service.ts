import { catchError, take, tap } from 'rxjs/operators'
import { AngularFireDatabase } from 'angularfire2/database'
import { Inject, Injectable, Optional } from '@angular/core'
import { HttpClient, HttpParams } from '@angular/common/http'
import {
  FIREBASE_USER_AUTH_TOKEN,
  LRU_CACHE,
  LruCache
} from './server.firebase.module'
import { Observable, of } from 'rxjs'
import { IUniversalRtdbService } from './rtdb.interface'
import { createHash } from 'crypto'

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

function getParams(fromObject = {}) {
  return new HttpParams({
    fromObject
  })
}

function mapUndefined(err: any) {
  return of(undefined)
}

function attemptToCacheInLru(key: string, lru?: LruCache) {
  return function(response?: any) {
    lru && lru.set(sha256(key), response)
  }
}

function attemptToGetCachedValue<T>(key: string, lru?: LruCache) {
  return lru && lru.get<T>(key)
}

// tslint:disable:no-this
// tslint:disable-next-line:no-class
@Injectable()
export class ServerUniversalRtDbService implements IUniversalRtdbService {
  constructor(
    private http: HttpClient,
    private afdb: AngularFireDatabase,
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
    const cachedValue = attemptToGetCachedValue<T>(cacheKey)

    const baseObs = this.authToken
      ? this.http.get<T>(url, { params })
      : this.http.get<T>(url)

    return cachedValue
      ? of(cachedValue)
      : baseObs.pipe(
          take(1),
          tap(attemptToCacheInLru(cacheKey, this.lru)),
          catchError(mapUndefined)
        )
  }
}
