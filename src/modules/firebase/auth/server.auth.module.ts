import { NgModule } from '@angular/core'
import { AngularFireAuthModule, AngularFireAuth } from 'angularfire2/auth'
import { FirebaseServerAuth } from './server.auth.service'

// tslint:disable-next-line:no-class
@NgModule({
  imports: [AngularFireAuthModule],
  exports: [AngularFireAuthModule],
  providers: [{ provide: AngularFireAuth, useClass: FirebaseServerAuth }]
})
export class FirebaseAuthServerModule {}
