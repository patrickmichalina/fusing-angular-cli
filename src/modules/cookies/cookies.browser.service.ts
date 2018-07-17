import { Injectable } from '@angular/core'
import { Subject } from 'rxjs'
import { ICookieService, StringDict, KeyValue } from './common'
import { CookieAttributes, getJSON, remove, set } from 'js-cookie'
import { filter } from 'rxjs/operators'

// tslint:disable:no-this
// tslint:disable-next-line:no-class
@Injectable()
export class CookieService implements ICookieService {
  private readonly cookieSource = new Subject<StringDict>()
  private readonly changeSource = new Subject<KeyValue>()
  public readonly valueChange = this.changeSource.asObservable()
  public readonly valueChanges = this.cookieSource.asObservable()

  targetValueChange(key: string) {
    return this.valueChange.pipe(filter(a => a && a.key === key))
  }

  public set(name: string, value: any, opts?: CookieAttributes): void {
    set(name, value, opts)
    this.updateSource()
    this.broadcastChange(name)
  }

  public remove(name: string, opts?: CookieAttributes): void {
    remove(name, opts)
    this.updateSource()
    this.broadcastChange(name)
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

  private broadcastChange(key: string) {
    this.changeSource.next({
      key,
      value: this.get(key)
    })
  }
}
