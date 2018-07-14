import { Inject, Injectable } from '@angular/core'
import { ENV_CONFIG } from './common'

export interface IBaseConfig {
  readonly [key: string]: string | undefined
  readonly env?: string
  readonly port?: string
}

export interface IEnvironmentService<TConfig extends IBaseConfig> {
  readonly config: TConfig
}

// tslint:disable-next-line:no-class
@Injectable()
export class EnvironmentService<TConfig extends IBaseConfig = IBaseConfig>
  implements IEnvironmentService<TConfig> {
  constructor(@Inject(ENV_CONFIG) public config: TConfig = {} as TConfig) {}
}
