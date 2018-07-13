import {
  catchError,
  filter,
  map,
  startWith,
  take,
  distinctUntilChanged
} from 'rxjs/operators'
import { ApplicationRef, Injectable, Inject } from '@angular/core'
import { AngularFireDatabase, QueryFn } from 'angularfire2/database'
import { makeStateKey, TransferState } from '@angular/platform-browser'
import { Observable, of } from 'rxjs'
import { IUniversalRtdbService } from './rtdb.interface'
import { FIREBASE_DATABASE_URL } from './tokens'
import { sha1 } from 'object-hash'

// tslint:disable:no-this
// tslint:disable-next-line:no-class
@Injectable()
export class UniversalRtDbService implements IUniversalRtdbService {
  // tslint:disable-next-line:readonly-keyword
  readFromCache = true

  constructor(
    public angularFireDatabase: AngularFireDatabase,
    private ts: TransferState,
    appRef: ApplicationRef,
    @Inject(FIREBASE_DATABASE_URL) private firebaseDatabaseUrl: string
  ) {
    appRef.isStable
      .pipe(
        filter(Boolean),
        take(1)
      )
      .subscribe(() => this.turnOffCache())
  }

  private turnOffCache() {
    // tslint:disable-next-line:no-object-mutation
    this.readFromCache = false
  }

  universalObject<T>(path: string): Observable<T | undefined> {
    const cached = this.ts.get<T | undefined>(this.cacheKey(path), undefined)
    const base = this.angularFireDatabase
      .object<T>(path)
      .valueChanges()
      .pipe(
        map(a => (a ? a : undefined)),
        catchError(() => of(undefined))
      )

    return !this.readFromCache
      ? base
      : base.pipe(
          startWith(cached),
          distinctUntilChanged((x, y) => (x && sha1(x)) === (y && sha1(y)))
        )
  }

  universalList<T>(
    path: string,
    queryFn?: QueryFn
  ): Observable<ReadonlyArray<T>> {
    const cached = this.ts.get<ReadonlyArray<T>>(this.cacheKey(path), [])
    const base = this.angularFireDatabase.list<T>(path, queryFn).valueChanges()
    return this.readFromCache
      ? base.pipe(
          startWith(cached),
          distinctUntilChanged((x, y) => (x && sha1(x)) === (y && sha1(y)))
        )
      : base
  }

  private cacheKey(path: string) {
    return makeStateKey<string>(`RTDB.${this.firebaseDatabaseUrl}/${path}.json`)
  }
}
