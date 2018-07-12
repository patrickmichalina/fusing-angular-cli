import { InjectionToken, NgModule } from '@angular/core'
import { ServerUniversalRtDbService } from './server.firebase.rtdb.service'
import { HttpClient } from '@angular/common/http'
import { UniversalRtDbService } from './browser.firebase.rtdb.service'
import { AngularFireDatabase } from 'angularfire2/database'

export const FIREBASE_USER_AUTH_TOKEN = new InjectionToken<string>(
  'fng.fb.svr.usr.auth'
)

export const FIREBASE_DATABASE_URL = new InjectionToken<string>('fng.fb.db.url')

// tslint:disable-next-line:no-class
@NgModule({
  providers: [
    {
      provide: UniversalRtDbService,
      useClass: ServerUniversalRtDbService,
      deps: [HttpClient, AngularFireDatabase, FIREBASE_USER_AUTH_TOKEN]
    }
  ]
})
export class FirebaseServerModule {}
