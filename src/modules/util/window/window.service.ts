import { Inject, Injectable } from '@angular/core'
import { WINDOW } from '../tokens'

export interface IWindowService {
  readonly window: <T>() => Window & T
}

// tslint:disable:no-class
// tslint:disable:no-this
@Injectable()
export class WindowService implements IWindowService {
  constructor(@Inject(WINDOW) private _window: any) {}

  public window<T>(): Window & T {
    return this._window as Window & T
  }
}
