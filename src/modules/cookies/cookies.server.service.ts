import { empty } from 'rxjs'
import { REQUEST } from '@nguniversal/express-engine/tokens'
import { Inject, Injectable } from '@angular/core'
import { ICookieService } from './common'
import * as express from 'express'

// tslint:disable:no-this
// tslint:disable-next-line:no-class
@Injectable()
export class ServerCookieService implements ICookieService {
  public readonly valueChange = empty()
  public readonly valueChanges = empty()

  constructor(@Inject(REQUEST) private req: express.Request) {}

  targetValueChange() {
    return empty()
  }

  public get(name: string): any {
    try {
      return JSON.parse(this.req.cookies[name])
    } catch (err) {
      return this.req ? this.req.cookies[name] : undefined
    }
  }

  public getAll(): any {
    return this.req && this.req.cookies
  }

  public set(): void {
    // noop
  }

  public remove(): void {
    // noop
  }

  updateSource() {
    // noop
  }
}
