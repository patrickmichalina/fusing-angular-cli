import { NgModule, Inject } from '@angular/core'
import { AngularFireAuth } from 'angularfire2/auth'
import { flatMap } from 'rxjs/operators'
import { ICookieGetSet } from './app.common'
import {
  FIREBASE_AUTH_COOKIE_FACTORY,
  FIREBASE_AUTH_COOKIE_STO_KEY
} from './tokens'
import { of } from 'rxjs'

// tslint:disable:no-this

function toExtractIdTokenFromUser(user: firebase.User | null) {
  return user ? user.getIdToken() : of(undefined).toPromise()
}

function storeJwtInCookies(cs: ICookieGetSet, storageKey: string) {
  return (jwt?: string) => {
    jwt ? cs.set(storageKey, jwt) : cs.remove(storageKey)
  }
}

// tslint:disable-next-line:no-class
@NgModule()
export class FirebaseAuthBrowserModule {
  constructor(
    public auth: AngularFireAuth,
    @Inject(FIREBASE_AUTH_COOKIE_STO_KEY) stoKey: string,
    @Inject(FIREBASE_AUTH_COOKIE_FACTORY) getSetFactory: ICookieGetSet
  ) {
    auth.user
      .pipe(flatMap(toExtractIdTokenFromUser))
      .subscribe(storeJwtInCookies(getSetFactory, stoKey))
  }
}
