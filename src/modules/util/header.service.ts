import { RESPONSE } from '@nguniversal/express-engine/tokens'
import { Inject, Injectable } from '@angular/core'
import * as express from 'express'

// tslint:disable:no-this
// tslint:disable:no-object-mutation
// tslint:disable-next-line:no-class
@Injectable()
export class HeaderService {
  constructor(@Inject(RESPONSE) private response: express.Response) {}
  getHeader(key: string): string | undefined {
    return this.response.getHeader(key) as string | undefined
  }

  setHeader(key: string, value: string): void {
    this.response.header(key, value)
  }

  setHeaders(dictionary: { readonly [key: string]: string }): void {
    Object.keys(dictionary).forEach(key => this.setHeader(key, dictionary[key]))
  }

  removeHeader(key: string): void {
    this.response.removeHeader(key)
  }

  appendHeader(key: string, value: string, delimiter = ','): void {
    const current = this.getHeader(key)

    // tslint:disable-next-line:no-if-statement
    if (!current) {
      this.setHeader(key, value)
    } else {
      const newValue = [...current.split(delimiter), value]
        .filter((el, i, a) => i === a.indexOf(el))
        .join(delimiter)
      this.response.header(key, newValue)
    }
  }
}
