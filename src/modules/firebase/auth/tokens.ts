import { ICookieGetSet } from './app.common'
import { InjectionToken } from '@angular/core'
import { StateKey } from '@angular/platform-browser'

export const FIREBASE_AUTH_COOKIE_FACTORY = new InjectionToken<ICookieGetSet>(
  'fng.auth.ck.get.set'
)
export const FIREBASE_AUTH_COOKIE_STO_KEY = new InjectionToken<string>(
  'fng.auth.ck.sto'
)
export const FIREBASE_AUTH_OBJ_TS = new InjectionToken<StateKey<any>>(
  'fng.fb.auth.ts'
)
