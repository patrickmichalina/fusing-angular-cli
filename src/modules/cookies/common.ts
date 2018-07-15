import { Observable } from 'rxjs'
import { CookieAttributes } from 'js-cookie'

export interface ICookieService {
  readonly valueChanges: Observable<StringDict>
  readonly getAll: () => any
  readonly get: (name: string) => any
  readonly set: (name: string, value: any, options?: CookieAttributes) => void
  readonly remove: (name: string, options?: CookieAttributes) => void
}

export interface StringDict {
  readonly [key: string]: any
}
