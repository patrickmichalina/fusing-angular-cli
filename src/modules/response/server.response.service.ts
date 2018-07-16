import { RESPONSE } from '@nguniversal/express-engine/tokens'
import { Inject, Injectable } from '@angular/core'
import { IResponseService } from './common'
import * as express from 'express'

// tslint:disable:no-this
// tslint:disable:no-object-mutation
// tslint:disable-next-line:no-class
@Injectable()
export class ServerResponseService implements IResponseService {
  constructor(@Inject(RESPONSE) private response: express.Response) {}

  set(code: number, message?: string): void {
    this.response.statusCode = code
    this.response.statusMessage = message || ''
  }

  ok(): void {
    this.set(200)
  }

  badRequest(message = 'Bad Request'): void {
    this.set(400, message)
  }

  unauthorized(message = 'Unauthorized'): void {
    this.set(401, message)
  }

  paymentRequired(message = 'Payment Required'): void {
    this.set(402, message)
  }

  forbidden(message = 'Forbidden'): void {
    this.set(403, message)
  }

  notFound(message = 'Not Found'): void {
    this.set(404, message)
  }

  error(message = 'Internal Server Error'): void {
    this.set(500, message)
  }

  notImplemented(message = 'Not Implemented'): void {
    this.set(501, message)
  }
}
