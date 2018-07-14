import {
  catchError,
  distinctUntilChanged,
  startWith,
  filter,
  take
} from 'rxjs/operators'
import { Injectable, ApplicationRef } from '@angular/core'
import { TransferState } from '@angular/platform-browser'
import { sha1 } from 'object-hash'
import { of } from 'rxjs'
import { AngularFirestore, QueryFn } from 'angularfire2/firestore'
import {
  IUniversalFirestoreService,
  extractFsHostFromLib
} from './browser.firebase.fs.common'
import {
  makeFirestoreStateTransferKey,
  constructFsUrl
} from './server.firebase.fs.common'

// tslint:disable:no-this
// tslint:disable-next-line:no-class
@Injectable()
export class UniversalFirestoreService implements IUniversalFirestoreService {
  constructor(
    private ts: TransferState,
    public afs: AngularFirestore,
    appRef: ApplicationRef
  ) {
    appRef.isStable
      .pipe(
        filter(Boolean),
        take(1)
      )
      .subscribe(() => this.turnOffCache())
  }

  // tslint:disable-next-line:readonly-keyword
  private readFromCache = true

  private turnOffCache() {
    // tslint:disable-next-line:no-object-mutation
    this.readFromCache = false
  }

  universalDoc<T>(path: string) {
    const url = constructFsUrl(extractFsHostFromLib(this.afs), path)
    const cached = this.ts.get<T | undefined>(
      makeFirestoreStateTransferKey(url),
      undefined
    )

    const base = this.afs.doc<T>(path).valueChanges()

    return this.readFromCache && cached
      ? base.pipe(
          startWith(cached as T),
          distinctUntilChanged((x, y) => sha1(x) === sha1(y)),
          catchError(err => of(undefined))
        )
      : base
  }

  universalCollection<T>(path: string, queryFn?: QueryFn) {
    const url = constructFsUrl(extractFsHostFromLib(this.afs), path, true)

    const cached = this.ts.get<ReadonlyArray<T>>(
      makeFirestoreStateTransferKey(url),
      []
    )
    const base = this.afs.collection<T>(path, queryFn).valueChanges()

    return this.readFromCache && cached.length > 0
      ? base.pipe(
          startWith(cached),
          distinctUntilChanged((x, y) => sha1(x) === sha1(y)),
          catchError(err => of(cached))
        )
      : base
  }
}
