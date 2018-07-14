import { AngularFireDatabase } from 'angularfire2/database'
import { Observable } from 'rxjs'
import { QueryFn } from 'angularfire2/database'

export interface IUniversalRtdbService {
  readonly universalObject: <T>(path: string) => Observable<T | undefined>
  readonly universalList: <T>(
    path: string,
    queryFn?: QueryFn
  ) => Observable<ReadonlyArray<T>>
}

export function extractRtDbHostFromLib(afRtDb: AngularFireDatabase) {
  return `https://${
    (afRtDb.database.app.options as any).projectId
  }.firebaseio.com`
}
