import { InjectionToken } from '@angular/core'
import { createHash } from 'crypto'
import { HttpParams } from '@angular/common/http'

export interface LruCache {
  readonly get: <T>(key: string) => T
  readonly set: <T>(key: string, value: T) => T
}

export const LRU_CACHE = new InjectionToken<LruCache>('fng.lru')
export const FIREBASE_USER_AUTH_TOKEN = new InjectionToken<string>(
  'fng.fb.svr.usr.auth'
)

function sha256(data: string) {
  return createHash('sha256')
    .update(data)
    .digest('base64')
}

export function attemptToCacheInLru(key: string, lru?: LruCache) {
  return function(response?: any) {
    lru && response && lru.set(sha256(key), response)
  }
}

export function attemptToGetLruCachedValue<T>(key: string, lru?: LruCache) {
  return lru && lru.get<T>(sha256(key))
}

export function getFullUrl(base: string, params: HttpParams) {
  const stringifiedParams = params.toString()
  return stringifiedParams ? `${base}?${params.toString()}` : base
}
