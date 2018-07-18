import { NgModule } from '@angular/core'
import { WindowBrowserModule } from '../util/window/window-browser.module'
import { CookiesBrowserModule } from '../cookies/browser'
import { EnvironmentBrowserModule } from '../environment'
import { ResponseBrowserModule } from '../response/browser'

// tslint:disable-next-line:no-class
@NgModule({
  imports: [
    WindowBrowserModule.forRoot(),
    CookiesBrowserModule,
    EnvironmentBrowserModule,
    ResponseBrowserModule
  ],
  exports: [
    WindowBrowserModule,
    CookiesBrowserModule,
    EnvironmentBrowserModule,
    ResponseBrowserModule
  ]
})
export class FusingAngularBrowserModule {}
