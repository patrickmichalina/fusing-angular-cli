import { NgModule } from '@angular/core'
import { AngularFireAuthModule } from 'angularfire2/auth'
import { CookieService } from '../../cookies/browser'
import { FirebaseUniversalAuthService } from './browser.auth.service'
import { makeStateKey } from '@angular/platform-browser'
import {
  FIREBASE_AUTH_COOKIE_STO_KEY,
  FIREBASE_AUTH_COOKIE_FACTORY,
  FIREBASE_AUTH_OBJ_TS
} from './tokens'
// import { FngFirebaseAuthLoadingComponent } from './loading-container/loading-container.component'

// tslint:disable:no-this
// tslint:disable-next-line:no-class
@NgModule({
  // declarations: [FngFirebaseAuthLoadingComponent],
  imports: [AngularFireAuthModule],
  exports: [AngularFireAuthModule],
  providers: [
    FirebaseUniversalAuthService,
    { provide: FIREBASE_AUTH_COOKIE_FACTORY, useClass: CookieService },
    { provide: FIREBASE_AUTH_COOKIE_STO_KEY, useValue: 'firebaseJWT' },
    { provide: FIREBASE_AUTH_OBJ_TS, useValue: makeStateKey('fng.fb.auth.ts') }
  ]
})
export class FirebaseAuthAppModule {}
