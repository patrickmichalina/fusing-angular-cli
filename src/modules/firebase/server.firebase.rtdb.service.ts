import { catchError, take } from 'rxjs/operators'
import { AngularFireDatabase } from 'angularfire2/database'
import { Inject, Injectable, Optional } from '@angular/core'
import { HttpClient, HttpParams } from '@angular/common/http'
import { FIREBASE_USER_AUTH_TOKEN } from './server.firebase.module'
import { Observable, of } from 'rxjs'
import { IUniversalRtdbService } from './rtdb.interface'

// tslint:disable:no-this
// tslint:disable-next-line:no-class
@Injectable()
export class ServerUniversalRtDbService implements IUniversalRtdbService {
  constructor(
    private http: HttpClient,
    private afdb: AngularFireDatabase,
    @Optional()
    @Inject(FIREBASE_USER_AUTH_TOKEN)
    private authToken?: string
  ) {}

  universalObject<T>(path: string): Observable<T | undefined> {
    const query = this.afdb.database.ref(path)
    const url = `${query.toString()}.json`
    const baseObs = this.authToken
      ? this.http.get<T>(url, {
          params: new HttpParams({
            fromObject: {
              auth: this.authToken
            }
          })
        })
      : this.http.get<T>(url)
    return baseObs.pipe(
      take(1),
      catchError(err => {
        return of(undefined)
      })
    )
  }
}
