import {
  ModuleWithProviders,
  NgModule,
  Optional,
  SkipSelf
} from '@angular/core'
import { WINDOW } from '../tokens'
import { WindowService } from './window.service'

// tslint:disable-next-line:no-class
@NgModule()
export class WindowServerModule {
  static forRoot(windowObject?: any): ModuleWithProviders {
    return {
      ngModule: WindowServerModule,
      providers: [
        { provide: WINDOW, useValue: windowObject || {} },
        WindowService
      ]
    }
  }

  constructor(
    @Optional()
    @SkipSelf()
    parentModule: WindowServerModule
  ) {
    // tslint:disable-next-line:no-if-statement
    if (parentModule)
      throw new Error(
        'WindowServerModule already loaded. Import in root module only.'
      )
  }
}
