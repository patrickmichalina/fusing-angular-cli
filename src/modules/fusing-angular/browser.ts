import { NgModule } from '@angular/core'
import { WindowBrowserModule } from '../util/window/window-browser.module'
import { CookiesBrowserModule } from '../cookies/browser'
import { EnvironmentBrowserModule } from '../environment'
import { ResponseBrowserModule } from '../response/browser'
import { ServiceWorkerModule } from '@angular/service-worker'

// tslint:disable-next-line:no-class
@NgModule({
  imports: [
    ServiceWorkerModule.register('/js/ngsw-worker.js', {
      enabled: false
    }),
    WindowBrowserModule.forRoot(),
    CookiesBrowserModule,
    EnvironmentBrowserModule,
    ResponseBrowserModule
  ],
  exports: [
    ServiceWorkerModule,
    WindowBrowserModule,
    CookiesBrowserModule,
    EnvironmentBrowserModule,
    ResponseBrowserModule
  ]
})
export class FusingAngularBrowserModule {}
