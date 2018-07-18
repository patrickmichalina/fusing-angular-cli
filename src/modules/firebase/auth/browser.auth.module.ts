import { NgModule, Inject } from '@angular/core'
import { AngularFireAuth } from 'angularfire2/auth'
import {
  flatMap,
  map,
  startWith,
  distinctUntilChanged,
  share
} from 'rxjs/operators'
import { FIREBASE_AUTH_COOKIE_STO_KEY } from './tokens'
import { of } from 'rxjs'
import { DOCUMENT } from '@angular/common'
import { CookieService } from '../../cookies/browser'

// tslint:disable:no-this

function toExtractIdTokenFromUser(user: firebase.User | null) {
  return user ? user.getIdToken() : of(undefined).toPromise()
}

function storeJwtInCookies(cs: CookieService, storageKey: string) {
  return (jwt?: string) => {
    jwt ? cs.set(storageKey, jwt) : cs.remove(storageKey)
  }
}

// tslint:disable-next-line:no-class
@NgModule()
export class FirebaseAuthBrowserModule {
  readonly waitingOnLoginProcess_ = this.cs
    .targetValueChange('waitOnAuthResponse')
    .pipe(
      map(a => a.value),
      startWith(this.cs.get('waitOnAuthResponse')),
      map(val => (val && val === true ? true : false)),
      distinctUntilChanged(),
      share()
    )

  constructor(
    public auth: AngularFireAuth,
    private cs: CookieService,
    @Inject(FIREBASE_AUTH_COOKIE_STO_KEY) stoKey: string,
    @Inject(DOCUMENT) private doc: HTMLDocument
  ) {
    auth.user
      .pipe(flatMap(toExtractIdTokenFromUser))
      .subscribe(storeJwtInCookies(cs, stoKey))

    this.waitingOnLoginProcess_.subscribe(v => {
      setTimeout(() => {
        const container = this.doc.querySelector(
          'fng-firebase-spin-container'
        ) as HTMLDivElement | undefined
        // tslint:disable:no-if-statement
        if (container) {
          if (v) {
            container.style.display = 'block'
          } else {
            container.style.display = 'none'
          }
        }
      }, 0)
    })

    this.auth.auth.getRedirectResult().then(() => {
      this.cs.remove('waitOnAuthResponse')
    })
  }
}
