import {
  InjectionToken,
  NgModule,
  ModuleWithProviders,
  Optional,
  SkipSelf
} from '@angular/core'
import { ServerUniversalRtDbService } from './server.firebase.rtdb.service'
import { UniversalRtDbService } from './browser.firebase.rtdb.service'

export interface LruCache {
  readonly get: <T>(key: string) => T
  readonly set: <T>(key: string, value: T) => T
}

export const LRU_CACHE = new InjectionToken<LruCache>('fng.lru')

// tslint:disable-next-line:no-class
@NgModule()
export class FirebaseServerModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: FirebaseServerModule,
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
    parentModule: FirebaseServerModule
  ) {
    // tslint:disable-next-line:no-if-statement
    if (parentModule)
      throw new Error(
        'FirebaseServerModule already loaded. Import in root module only.'
      )
  }
}
