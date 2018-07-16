import { Injectable } from '@angular/core'
import { IResponseService } from './common'

// tslint:disable:no-this
// tslint:disable:no-object-mutation
// tslint:disable-next-line:no-class
@Injectable()
export class ResponseService implements IResponseService {
  set(): void {
    // noop on browser
  }

  ok(): void {
    // noop on browser
  }

  badRequest(): void {
    // noop on browser
  }

  unauthorized(): void {
    // noop on browser
  }

  paymentRequired(): void {
    // noop on browser
  }

  forbidden(): void {
    // noop on browser
  }

  notFound(): void {
    // noop on browser
  }

  error(): void {
    // noop on browser
  }

  notImplemented(): void {
    // noop on browser
  }
}
