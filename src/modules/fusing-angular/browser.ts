import { NgModule } from '@angular/core'
import { WindowBrowserModule } from '../util/window/window-browser.module'
import { CookiesBrowserModule } from '../cookies/browser'
import { EnvironmentBrowserModule } from '../environment'
import { ResponseBrowserModule } from '../response/browser'
import { ServiceWorkerModule } from '@angular/service-worker'
import {
  BrowserTransferStateModule,
  BrowserModule
} from '@angular/platform-browser'

// tslint:disable-next-line:no-class
@NgModule({
  imports: [
    BrowserModule.withServerTransition({ appId: 'app-root' }),
    BrowserTransferStateModule,
    ServiceWorkerModule.register('/js/ngsw-worker.js', {
      enabled: false
    }),
    WindowBrowserModule.forRoot(),
    CookiesBrowserModule,
    EnvironmentBrowserModule,
    ResponseBrowserModule
  ],
  exports: [
    BrowserModule,
    BrowserTransferStateModule,
    ServiceWorkerModule,
    WindowBrowserModule,
    CookiesBrowserModule,
    EnvironmentBrowserModule,
    ResponseBrowserModule
  ]
})
export class FusingAngularBrowserModule {}
