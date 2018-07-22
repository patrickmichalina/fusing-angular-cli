import { AngularFireAuth } from 'angularfire2/auth'
import { Injectable, Inject } from '@angular/core'
import { startWith } from 'rxjs/operators'
import { TransferState, StateKey } from '@angular/platform-browser'
import { FIREBASE_AUTH_OBJ_TS } from './tokens'

// tslint:disable:no-this
// tslint:disable-next-line:no-class
@Injectable()
export class FirebaseUniversalAuthService {
  constructor(
    private auth: AngularFireAuth,
    private ts: TransferState,
    @Inject(FIREBASE_AUTH_OBJ_TS) private tsKey: StateKey<any>
  ) {}

  readonly fbAuth = this.auth
  readonly user = this.auth.user.pipe(
    startWith(this.ts.get(this.tsKey, undefined))
  )
}
