import { ICookieGetSet } from './app.common'
import { InjectionToken } from '@angular/core'
import { makeStateKey } from '@angular/platform-browser'

export const FIREBASE_AUTH_COOKIE_FACTORY = new InjectionToken<ICookieGetSet>(
  'fng.auth.ck.get.set'
)
export const FIREBASE_AUTH_COOKIE_STO_KEY = new InjectionToken<string>(
  'fng.auth.ck.sto'
)
export const FIREBASE_AUTH_OBJ_TS = makeStateKey('fng.fb.auth.ts')
