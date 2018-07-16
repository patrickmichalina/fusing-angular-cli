import { NgModule } from '@angular/core'
import { ResponseService } from './browser.response.service'
import { ServerResponseService } from './server.response.service'

// tslint:disable-next-line:no-class
@NgModule({
  providers: [{ provide: ResponseService, useClass: ServerResponseService }]
})
export class ResponseServerModule {}
