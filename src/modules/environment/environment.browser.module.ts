import { NgModule } from '@angular/core'
import { EnvironmentService } from './environment.service'
import { ENV_CONFIG, ENV_CONFIG_TS_KEY } from './common'
import { TransferState } from '@angular/platform-browser'

export function fuseBoxConfigFactory(ts: TransferState) {
  return ts.get(ENV_CONFIG_TS_KEY, {})
}

// tslint:disable-next-line:no-class
@NgModule({
  providers: [
    EnvironmentService,
    {
      provide: ENV_CONFIG,
      useFactory: fuseBoxConfigFactory,
      deps: [TransferState]
    }
  ]
})
export class EnvironmentBrowserModule {}
