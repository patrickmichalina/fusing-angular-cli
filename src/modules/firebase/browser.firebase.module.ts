import {
  NgModule,
  ModuleWithProviders,
  Optional,
  SkipSelf
} from '@angular/core'
import { UniversalRtDbService } from './browser.firebase.rtdb.service'

// tslint:disable-next-line:no-class
@NgModule()
export class FirebaseBrowserModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: FirebaseBrowserModule,
      providers: [UniversalRtDbService]
    }
  }

  constructor(
    @Optional()
    @SkipSelf()
    parentModule: FirebaseBrowserModule
  ) {
    // tslint:disable-next-line:no-if-statement
    if (parentModule)
      throw new Error(
        'FirebaseBrowserModule already loaded. Import in root module only.'
      )
  }
}
