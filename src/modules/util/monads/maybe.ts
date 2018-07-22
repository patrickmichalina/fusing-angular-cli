// tslint:disable:no-this
// tslint:disable-next-line:no-class
export class Maybe<T> {
  private constructor(private value?: T) {}

  static some<T>(value: T) {
    // tslint:disable-next-line:no-if-statement
    if (!value) {
      throw Error('Provided value must not be empty')
    }
    return new Maybe(value)
  }

  static none<T>() {
    return new Maybe<T>(undefined)
  }

  static fromValue<T>(value: T) {
    return value
      ? Maybe.some<NonNullable<T>>(value as NonNullable<T>)
      : Maybe.none<NonNullable<T>>()
  }

  getOrElse(defaultValue: T) {
    return this.value === undefined ? defaultValue : this.value
  }

  map<R>(f: (wrapped: T) => R): Maybe<R> {
    return this.value === undefined
      ? Maybe.none<R>()
      : Maybe.some(f(this.value))
  }

  doIfSome<R>(f: (wrapped: T) => R): void {
    this.value && f(this.value)
  }

  flattenMap<R>(f: (wrapped: T) => Maybe<R>): Maybe<R> {
    return this.value === undefined ? Maybe.none<R>() : f(this.value)
  }
}
