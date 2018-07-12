import {
  InjectionToken,
  NgModule,
  ModuleWithProviders,
  Optional,
  SkipSelf
} from '@angular/core'
import { ServerUniversalRtDbService } from './server.firebase.rtdb.service'
import { HttpClient } from '@angular/common/http'
import { UniversalRtDbService } from './browser.firebase.rtdb.service'
import { AngularFireDatabase } from 'angularfire2/database'

export interface LruCache {
  readonly get: <T>(key: string) => T
  readonly set: <T>(key: string, value: T) => T
}

export const FIREBASE_USER_AUTH_TOKEN = new InjectionToken<string>(
  'fng.fb.svr.usr.auth'
)

export const FIREBASE_DATABASE_URL = new InjectionToken<string>('fng.fb.db.url')
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
          useClass: ServerUniversalRtDbService,
          deps: [
            HttpClient,
            AngularFireDatabase,
            FIREBASE_USER_AUTH_TOKEN,
            LRU_CACHE
          ]
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
