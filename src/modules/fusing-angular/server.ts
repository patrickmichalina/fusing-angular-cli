import { NgModule } from '@angular/core'
import { WindowServerModule } from '../util/window/window-server.module'
import { EnvironmentServerModule } from '../environment'
import { CookiesServerModule } from '../cookies/server'
import { ResponseServerModule } from '../response/server'
import {
  ServerModule,
  ServerTransferStateModule
} from '@angular/platform-server'

// tslint:disable-next-line:no-class
@NgModule({
  imports: [
    ServerTransferStateModule,
    WindowServerModule.forRoot({}),
    EnvironmentServerModule,
    CookiesServerModule,
    ResponseServerModule,
    ServerModule
  ],
  exports: [
    ServerTransferStateModule,
    WindowServerModule,
    EnvironmentServerModule,
    CookiesServerModule,
    ResponseServerModule,
    ServerModule
  ]
})
export class FusingAngularServerModule {}
