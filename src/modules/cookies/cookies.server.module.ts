import { NgModule } from '@angular/core'
import { CookieService } from './cookies.browser.service'
import { ServerCookieService } from './cookies.server.service'

// tslint:disable-next-line:no-class
@NgModule({
  providers: [{ provide: CookieService, useClass: ServerCookieService }]
})
export class CookiesServerModule {}
