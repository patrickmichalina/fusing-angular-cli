import { catchError, filter, map, startWith, take } from 'rxjs/operators'
import { ApplicationRef, Injectable, Inject } from '@angular/core'
import { AngularFireDatabase } from 'angularfire2/database'
import { makeStateKey, TransferState } from '@angular/platform-browser'
import { Observable, of } from 'rxjs'
import { FIREBASE_DATABASE_URL } from './server.firebase.module'
import { IUniversalRtdbService } from './rtdb.interface'
// import { sha1 } from 'object-hash'

interface CachedHttp<T> {
  readonly body: T
}

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
    const cached = this.ts.get<CachedHttp<T> | undefined>(
      this.cacheKey(path),
      undefined
    )
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
          startWith(cached && cached.body)
          // distinctUntilChanged((x, y) => (x && sha1(x)) === (y && sha1(y)))
        )
  }

  private cacheKey(path: string) {
    return makeStateKey<string>(`G.${this.firebaseDatabaseUrl}/${path}.json`)
  }
}
