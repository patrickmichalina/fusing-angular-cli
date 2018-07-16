import { NgModule } from '@angular/core'
import { AngularFireAuthModule, AngularFireAuth } from 'angularfire2/auth'

// tslint:disable-next-line:no-class
@NgModule({
  imports: [AngularFireAuthModule],
  exports: [AngularFireAuthModule]
})
export class FirebaseAuthBrowserModule {
  constructor(public auth: AngularFireAuth) {
    // TODO
  }
}
