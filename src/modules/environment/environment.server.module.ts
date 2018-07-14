import { NgModule, APP_BOOTSTRAP_LISTENER, ApplicationRef } from '@angular/core'
import { EnvironmentService, IBaseConfig } from './environment.service'
import { ENV_CONFIG, ENV_CONFIG_TS_KEY } from './common'
import { TransferState } from '@angular/platform-browser'
import { filter, first, take } from 'rxjs/operators'
import { REQUEST } from '@nguniversal/express-engine/tokens'

function getConfigFromProcess() {
  return JSON.parse(process.env.FUSING_ANGULAR || '{}')
}

export function serverEnvConfigFactory() {
  return getConfigFromProcess()
}

// IF ENV CONTAINS SERVER_, remove from object
function removeServerSpecific(
  obj: { readonly [key: string]: string },
  filterKey = 'SERVER_'
) {
  return Object.keys(obj)
    .filter(key => !key.includes(filterKey))
    .reduce((acc, curr) => {
      return {
        ...acc,
        [curr]: obj[curr]
      }
    }, {})
}

export function onBootstrap(
  appRef: ApplicationRef,
  transferState: TransferState,
  req: any
) {
  return () => {
    appRef.isStable
      .pipe(
        filter(Boolean),
        first(),
        take(1)
      )
      .subscribe(() => {
        transferState.set<IBaseConfig>(
          ENV_CONFIG_TS_KEY,
          removeServerSpecific(getConfigFromProcess())
        )
      })
  }
}

// tslint:disable-next-line:no-class
@NgModule({
  providers: [
    EnvironmentService,
    { provide: ENV_CONFIG, useFactory: serverEnvConfigFactory },
    {
      provide: APP_BOOTSTRAP_LISTENER,
      useFactory: onBootstrap,
      deps: [ApplicationRef, TransferState, REQUEST],
      multi: true
    }
  ]
})
export class EnvironmentServerModule {}
