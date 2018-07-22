import { NgModule, APP_INITIALIZER } from '@angular/core'
import { AngularFireAuth } from 'angularfire2/auth'
import { FirebaseServerAuth } from './server.auth.service'
import {
  FIREBASE_AUTH_SERVER_ADMIN_APP,
  FIREBASE_AUTH_SERVER_USER_JWT
} from './server.common'
import { initializeApp, credential, auth, apps } from 'firebase-admin'
import { EnvironmentService } from '../../environment'
import { FIREBASE_AUTH_COOKIE_STO_KEY, FIREBASE_AUTH_OBJ_TS } from './tokens'
import { CookieService } from '../../cookies/browser'
import { TransferState, StateKey } from '@angular/platform-browser'
import { take, tap } from 'rxjs/operators'
import { FirebaseUniversalAuthService } from './browser.auth.service'

function firebaseAdminAppAlreadyExists() {
  return apps.length ? true : false
}

function repairInlinePem(str?: string) {
  return str ? str.replace(/\\n/g, '\n') : ''
}

export function fbAdminFactory(es: EnvironmentService) {
  !firebaseAdminAppAlreadyExists() &&
    initializeApp({
      credential: credential.cert({
        projectId: es.config.FIREBASE_PROJECT_ID,
        clientEmail: es.config.SERVER_FIREBASE_CLIENT_EMAIL,
        privateKey: repairInlinePem(es.config.SERVER_FIREBASE_PRIVATE_KEY)
      }),
      databaseURL: es.config.FIREBASE_DATABASE_URL
    })
  return auth()
}

export function getUserJwt(cs: CookieService, key: string) {
  return cs.get(key)
}

export function onBootstrap(
  transferState: TransferState,
  auth: FirebaseServerAuth,
  tsKey: StateKey<string>
) {
  return () => {
    return auth.user
      .pipe(
        take(1),
        tap(user => transferState.set(tsKey, user))
      )
      .toPromise()
  }
}

// tslint:disable-next-line:no-class
@NgModule({
  providers: [
    FirebaseServerAuth,
    { provide: AngularFireAuth, useExisting: FirebaseServerAuth },
    {
      provide: FirebaseUniversalAuthService,
      useExisting: FirebaseServerAuth
    },
    {
      provide: FIREBASE_AUTH_SERVER_ADMIN_APP,
      useFactory: fbAdminFactory,
      deps: [EnvironmentService]
    },
    {
      provide: FIREBASE_AUTH_SERVER_USER_JWT,
      useFactory: getUserJwt,
      deps: [CookieService, FIREBASE_AUTH_COOKIE_STO_KEY]
    },
    {
      provide: APP_INITIALIZER,
      useFactory: onBootstrap,
      deps: [TransferState, FirebaseServerAuth, FIREBASE_AUTH_OBJ_TS],
      multi: true
    }
  ]
})
export class FirebaseAuthServerModule {}
