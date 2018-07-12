import { Observable } from 'rxjs'

export interface IUniversalRtdbService {
  readonly universalObject: <T>(path: string) => Observable<T | undefined>
}
