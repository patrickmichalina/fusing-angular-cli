import { Injectable, Inject } from '@angular/core'
import {
  FIREBASE_AUTH_SERVER_ADMIN_APP,
  FIREBASE_AUTH_SERVER_USER_JWT
} from './server.common'
import { auth } from 'firebase-admin'
import { of } from 'rxjs'
import { flatMap } from 'rxjs/operators'

function validateToken(auth: auth.Auth, jwt: string) {
  return of(auth.verifyIdToken(jwt))
}

// tslint:disable:no-this
// tslint:disable-next-line:no-class
@Injectable()
export class FirebaseServerAuth {
  constructor(
    @Inject(FIREBASE_AUTH_SERVER_ADMIN_APP) private authAdmin: auth.Auth,
    @Inject(FIREBASE_AUTH_SERVER_USER_JWT) private jwt: string
  ) {}

  readonly validatedToken_ = this.jwt
    ? validateToken(this.authAdmin, this.jwt).pipe(flatMap(a => a))
    : of(null)

  readonly user = this.validatedToken_
  readonly authState = this.validatedToken_
  readonly idTokenResult = of(this.jwt)
  readonly idToken = this.jwt
}
