import { Injectable } from '@angular/core'
import { of } from 'rxjs'

// tslint:disable-next-line:no-class
@Injectable()
export class FirebaseServerAuth {
  readonly user = of({})
  readonly authState = of({})
  readonly idToken = ''
  readonly idTokenResult = of({})
}
