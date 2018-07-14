import { NgModule } from '@angular/core'
import {
  FirebaseNameOrConfigToken,
  FirebaseOptionsToken,
  AngularFireModule
} from 'angularfire2'
import { EnvironmentService } from '../environment'
import { FIREBASE_USER_AUTH_TOKEN } from './common/server'

export interface IFirebaseEnvConfig {
  readonly [key: string]: string | undefined
  readonly FIREBASE_API_KEY: string
  readonly FIREBASE_AUTH_DOMAIN: string
  readonly FIREBASE_DATABASE_URL: string
  readonly FIREBASE_PROJECT_ID: string
  readonly FIREBASE_STORAGE_BUCKET: string
  readonly FIREBASE_MESSAGING_SENDER_ID: string
}

export function firebaseEnvironmentFactory(
  es: EnvironmentService<IFirebaseEnvConfig>
) {
  return {
    apiKey: es.config.FIREBASE_API_KEY,
    authDomain: es.config.FIREBASE_AUTH_DOMAIN,
    databaseURL: es.config.FIREBASE_DATABASE_URL,
    projectId: es.config.FIREBASE_PROJECT_ID,
    storageBucket: es.config.FIREBASE_STORAGE_BUCKET,
    messagingSenderId: es.config.FIREBASE_MESSAGING_SENDER_ID
  }
}

// tslint:disable-next-line:no-class
@NgModule({
  imports: [AngularFireModule],
  providers: [
    { provide: FIREBASE_USER_AUTH_TOKEN, useValue: undefined },
    {
      provide: FirebaseNameOrConfigToken,
      useValue: 'universal-webapp'
    },
    {
      provide: FirebaseOptionsToken,
      useFactory: firebaseEnvironmentFactory,
      deps: [EnvironmentService]
    }
  ]
})
export class FirebaseUniversalAppModule {}
