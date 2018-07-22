import { InjectionToken } from '@angular/core'
import { auth } from 'firebase-admin'

export const FIREBASE_AUTH_SERVER_ADMIN_APP = new InjectionToken<auth.Auth>(
  'fng.fb.svr.auth.admin'
)
export const FIREBASE_AUTH_SERVER_USER_JWT = new InjectionToken<string>(
  'fng.fb.svr.auth.jwt'
)
