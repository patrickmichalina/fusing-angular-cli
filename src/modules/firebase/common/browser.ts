import {
  TransferState,
  StateKey,
  makeStateKey
} from '@angular/platform-browser'
import { HttpParams } from '@angular/common/http'

export function removeHttpInterceptorCache<T>(ts: TransferState, key: string) {
  return function(val: T) {
    ts.remove(makeStateKey<string>(`G.${key}`))
  }
}

export function cacheInStateTransfer<T>(
  ts: TransferState,
  key: StateKey<string>
) {
  return function(val: T) {
    ts.set(key, val)
  }
}

export function getParams(fromObject = {} as any) {
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
