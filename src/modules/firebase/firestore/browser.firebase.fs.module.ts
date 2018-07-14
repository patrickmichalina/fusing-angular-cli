import {
  NgModule,
  ModuleWithProviders,
  Optional,
  SkipSelf
} from '@angular/core'
import { UniversalFirestoreService } from './browser.firebase.fs.service'

// tslint:disable-next-line:no-class
@NgModule()
export class FirebaseFsBrowserModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: FirebaseFsBrowserModule,
      providers: [UniversalFirestoreService]
    }
  }

  constructor(
    @Optional()
    @SkipSelf()
    parentModule: FirebaseFsBrowserModule
  ) {
    // tslint:disable-next-line:no-if-statement
    if (parentModule)
      throw new Error(
        'FirebaseFsBrowserModule already loaded. Import in root module only.'
      )
  }
}
