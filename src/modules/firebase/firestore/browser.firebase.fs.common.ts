import { AngularFirestore, QueryFn } from 'angularfire2/firestore'
import { Observable } from 'rxjs'

export interface IUniversalFirestoreService {
  readonly universalDoc: <T>(path: string) => Observable<T | undefined>
  readonly universalCollection: <T>(
    path: string,
    queryFn?: QueryFn
  ) => Observable<ReadonlyArray<T>>
}

export function extractFsHostFromLib(affs: AngularFirestore) {
  return (affs.firestore.app.options as any).projectId
}
