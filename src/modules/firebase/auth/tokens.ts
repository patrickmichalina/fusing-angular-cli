import { ICookieGetSet } from './app.common'
import { InjectionToken } from '@angular/core'

export const FIREBASE_AUTH_COOKIE_FACTORY = new InjectionToken<ICookieGetSet>(
  'fng.auth.ck.get.set'
)
export const FIREBASE_AUTH_COOKIE_STO_KEY = new InjectionToken<string>(
  'fng.auth.ck.sto'
)
