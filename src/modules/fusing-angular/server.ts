import { NgModule } from '@angular/core'
import { WindowServerModule } from '../util/window/window-server.module'
import { EnvironmentServerModule } from '../environment'
import { CookiesServerModule } from '../cookies/server'
import { ResponseServerModule } from '../response/server'

// tslint:disable-next-line:no-class
@NgModule({
  imports: [
    WindowServerModule.forRoot({}),
    EnvironmentServerModule,
    CookiesServerModule,
    ResponseServerModule
  ],
  exports: [
    WindowServerModule,
    EnvironmentServerModule,
    CookiesServerModule,
    ResponseServerModule
  ]
})
export class FusingAngularServerModule {}
