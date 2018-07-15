import { Injectable } from '@angular/core'
import { Subject } from 'rxjs'
import { CookieAttributes, getJSON, remove, set } from 'js-cookie'
import { ICookieService, StringDict } from './common'

// tslint:disable:no-this
// tslint:disable-next-line:no-class
@Injectable()
export class CookieService implements ICookieService {
  private readonly cookieSource = new Subject<StringDict>()
  public readonly valueChanges = this.cookieSource.asObservable()

  public set(name: string, value: any, opts?: CookieAttributes): void {
    set(name, value, opts)
    this.updateSource()
  }

  public remove(name: string, opts?: CookieAttributes): void {
    remove(name, opts)
    this.updateSource()
  }

  public get(name: string): any {
    return getJSON(name)
  }

  public getAll(): any {
    return getJSON()
  }

  private updateSource() {
    this.cookieSource.next(this.getAll())
  }
}
