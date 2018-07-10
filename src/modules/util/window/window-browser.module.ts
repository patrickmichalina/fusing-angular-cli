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
export class WindowBrowserModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: WindowBrowserModule,
      providers: [{ provide: WINDOW, useValue: window }, WindowService]
    }
  }

  constructor(
    @Optional()
    @SkipSelf()
    parentModule: WindowBrowserModule
  ) {
    // tslint:disable-next-line:no-if-statement
    if (parentModule)
      throw new Error(
        'WindowBrowserModule already loaded. Import in root module only.'
      )
  }
}
