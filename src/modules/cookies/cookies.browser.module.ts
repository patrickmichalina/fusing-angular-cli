import { NgModule } from '@angular/core'
import { CookieService } from './cookies.browser.service'

// tslint:disable-next-line:no-class
@NgModule({
  providers: [CookieService]
})
export class CookiesBrowserModule {}
