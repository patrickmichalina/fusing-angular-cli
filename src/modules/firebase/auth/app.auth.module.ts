import { NgModule } from '@angular/core'
import { AngularFireAuthModule } from 'angularfire2/auth'
import {
  FIREBASE_AUTH_COOKIE_STO_KEY,
  FIREBASE_AUTH_COOKIE_FACTORY
} from './tokens'
import { CookieService } from '../../cookies/browser'

// tslint:disable:no-this
// tslint:disable-next-line:no-class
@NgModule({
  imports: [AngularFireAuthModule],
  exports: [AngularFireAuthModule],
  providers: [
    { provide: FIREBASE_AUTH_COOKIE_FACTORY, useClass: CookieService },
    { provide: FIREBASE_AUTH_COOKIE_STO_KEY, useValue: 'firebaseJWT' }
  ]
})
export class FirebaseAuthAppModule {}
