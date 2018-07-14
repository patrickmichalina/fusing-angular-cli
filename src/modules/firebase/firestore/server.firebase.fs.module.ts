import {
  NgModule,
  ModuleWithProviders,
  Optional,
  SkipSelf
} from '@angular/core'
import { UniversalFirestoreService } from './browser.firebase.fs.service'
import { ServerUniversalFirestoreService } from './server.firebase.fs.service'
import { AngularFirestoreModule } from 'angularfire2/firestore'

// tslint:disable-next-line:no-class
@NgModule({
  imports: [AngularFirestoreModule],
  exports: [AngularFirestoreModule]
})
export class FirebaseFsServerModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: FirebaseFsServerModule,
      providers: [
        {
          provide: UniversalFirestoreService,
          useClass: ServerUniversalFirestoreService
        }
      ]
    }
  }

  constructor(
    @Optional()
    @SkipSelf()
    parentModule: FirebaseFsServerModule
  ) {
    // tslint:disable-next-line:no-if-statement
    if (parentModule)
      throw new Error(
        'FirebaseFsServerModule already loaded. Import in root module only.'
      )
  }
}
