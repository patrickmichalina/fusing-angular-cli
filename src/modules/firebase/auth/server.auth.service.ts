import { Injectable, Inject } from '@angular/core'
import {
  FIREBASE_AUTH_SERVER_ADMIN_APP,
  FIREBASE_AUTH_SERVER_USER_JWT,
  FIREBASE_AUTH_OBJ_TS
} from './server.common'
import { auth } from 'firebase-admin'
import { of } from 'rxjs'
import { flatMap, catchError, map, tap } from 'rxjs/operators'
import { TransferState } from '@angular/platform-browser'

function validateToken(auth: auth.Auth, jwt: string) {
  return of(auth.verifyIdToken(jwt))
}

function byMappingItToUndefined(err: any) {
  return of(undefined)
}

function cacheToBrowser(ts: TransferState) {
  return function(obj: any) {
    ts.set(FIREBASE_AUTH_OBJ_TS, obj)
  }
}

function toPsuedoUserObject(jwtObj: any) {
  return {
    isAnonymous: jwtObj.provider_id && jwtObj.provider_id === 'anonymous',
    uid: jwtObj.user_id,
    displayName: jwtObj.name,
    email: jwtObj.email,
    emailVerified: jwtObj.email_verified,
    photoURL: jwtObj.picture,
    phoneNumber: jwtObj.phone_number,
    providerId: jwtObj.firebase && jwtObj.firebase.sign_in_provider
  }
}

// tslint:disable:no-this
// tslint:disable-next-line:no-class
@Injectable()
export class FirebaseServerAuth {
  constructor(
    private ts: TransferState,
    @Inject(FIREBASE_AUTH_SERVER_ADMIN_APP) private authAdmin: auth.Auth,
    @Inject(FIREBASE_AUTH_SERVER_USER_JWT) private jwt: string
  ) {}

  readonly validatedToken_ = this.jwt
    ? validateToken(this.authAdmin, this.jwt).pipe(
        flatMap(a => a),
        map(toPsuedoUserObject),
        tap(cacheToBrowser(this.ts)),
        catchError(byMappingItToUndefined)
      )
    : of(null)

  readonly user = this.validatedToken_
  readonly authState = this.validatedToken_
  readonly idTokenResult = of(this.jwt)
  readonly idToken = this.jwt
}
