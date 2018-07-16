import { NgModule } from '@angular/core'
import { AngularFireAuth } from 'angularfire2/auth'
import { FirebaseServerAuth } from './server.auth.service'

// tslint:disable-next-line:no-class
@NgModule({
  providers: [{ provide: AngularFireAuth, useClass: FirebaseServerAuth }]
})
export class FirebaseAuthServerModule {}
