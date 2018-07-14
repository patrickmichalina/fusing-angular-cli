import { InjectionToken } from '@angular/core'
import { makeStateKey } from '@angular/platform-browser'

export const ENV_CONFIG = new InjectionToken<any>('cfg.env')
export const ENV_CONFIG_TS_KEY = makeStateKey<any>('cfg.env.ts')
