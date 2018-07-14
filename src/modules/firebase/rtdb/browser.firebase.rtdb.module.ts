import {
  NgModule,
  ModuleWithProviders,
  Optional,
  SkipSelf
} from '@angular/core'
import { UniversalRtDbService } from './browser.firebase.rtdb.service'
import { AngularFireDatabaseModule } from 'angularfire2/database'

// tslint:disable-next-line:no-class
@NgModule({
  imports: [AngularFireDatabaseModule],
  exports: [AngularFireDatabaseModule]
})
export class FirebaseRtDbBrowserModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: FirebaseRtDbBrowserModule,
      providers: [UniversalRtDbService]
    }
  }

  constructor(
    @Optional()
    @SkipSelf()
    parentModule: FirebaseRtDbBrowserModule
  ) {
    // tslint:disable-next-line:no-if-statement
    if (parentModule)
      throw new Error(
        'FirebaseRtDbBrowserModule already loaded. Import in root module only.'
      )
  }
}
