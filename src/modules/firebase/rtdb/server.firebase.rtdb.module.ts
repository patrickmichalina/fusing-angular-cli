import {
  NgModule,
  ModuleWithProviders,
  Optional,
  SkipSelf
} from '@angular/core'
import { ServerUniversalRtDbService } from './server.firebase.rtdb.service'
import { UniversalRtDbService } from './browser.firebase.rtdb.service'
import { AngularFireDatabaseModule } from 'angularfire2/database'

// tslint:disable-next-line:no-class
@NgModule({
  imports: [AngularFireDatabaseModule],
  exports: [AngularFireDatabaseModule]
})
export class FirebaseRtDbServerModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: FirebaseRtDbServerModule,
      providers: [
        {
          provide: UniversalRtDbService,
          useClass: ServerUniversalRtDbService
        }
      ]
    }
  }

  constructor(
    @Optional()
    @SkipSelf()
    parentModule: FirebaseRtDbServerModule
  ) {
    // tslint:disable-next-line:no-if-statement
    if (parentModule)
      throw new Error(
        'FirebaseRtDbServerModule already loaded. Import in root module only.'
      )
  }
}
