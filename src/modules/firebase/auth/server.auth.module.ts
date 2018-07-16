import { NgModule } from '@angular/core'
import { AngularFireAuth } from 'angularfire2/auth'
import { FirebaseServerAuth } from './server.auth.service'
import {
  FIREBASE_AUTH_SERVER_ADMIN_APP,
  FIREBASE_AUTH_SERVER_USER_JWT
} from './server.common'
import { initializeApp, credential, auth } from 'firebase-admin'
import { EnvironmentService } from '../../environment'
import { FIREBASE_AUTH_COOKIE_STO_KEY } from './tokens'
import { CookieService } from '../../cookies/browser'

export function fbAdminFactory(es: EnvironmentService) {
  initializeApp({
    credential: credential.cert({
      projectId: es.config.FIREBASE_PROJECT_ID,
      clientEmail: es.config.SERVER_FIREBASE_CLIENT_EMAIL,
      privateKey: es.config.SERVER_FIREBASE_PRIVATE_KEY
    }),
    databaseURL: es.config.FIREBASE_DATABASE_URL
  })
  return auth()
}

export function getUserJwt(cs: CookieService, key: string) {
  return cs.get(key)
}

// tslint:disable-next-line:no-class
@NgModule({
  providers: [
    { provide: AngularFireAuth, useClass: FirebaseServerAuth },
    {
      provide: FIREBASE_AUTH_SERVER_ADMIN_APP,
      useFactory: fbAdminFactory,
      deps: [EnvironmentService]
    },
    {
      provide: FIREBASE_AUTH_SERVER_USER_JWT,
      useFactory: getUserJwt,
      deps: [CookieService, FIREBASE_AUTH_COOKIE_STO_KEY]
    }
  ]
})
export class FirebaseAuthServerModule {}
