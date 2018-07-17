import { Observable } from 'rxjs'
import { CookieAttributes } from 'js-cookie'

export interface KeyValue {
  readonly key: string
  readonly value: any
}

export interface ICookieService {
  readonly valueChange: Observable<KeyValue>
  readonly valueChanges: Observable<StringDict>
  readonly targetValueChange: (key: string) => Observable<KeyValue>
  readonly getAll: () => any
  readonly get: (name: string) => any
  readonly set: (name: string, value: any, options?: CookieAttributes) => void
  readonly remove: (name: string, options?: CookieAttributes) => void
}

export interface StringDict {
  readonly [key: string]: any
}
