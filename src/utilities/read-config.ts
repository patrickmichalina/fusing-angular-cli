import { map, catchError } from 'rxjs/operators'
import { readFile_ } from './rx-fs'
import * as favs from 'favicons'

const configPath = 'fusing-angular.json'

export interface FaviconConfig {
  readonly source: string
  readonly output: string
  readonly configuration: favs.Configuration
}

export interface FuseBoxBaseConfig {
  readonly homeDir: string
  readonly outputDir: string
}

export interface FuseBoxServerConfig extends FuseBoxBaseConfig {
  readonly serverModule: string
}

export interface FuseBoxBrowserConfig extends FuseBoxBaseConfig {
  readonly browserModule: string
  readonly prod: {
    readonly uglify: boolean
    readonly treeshake: boolean
  }
}

export interface FuseBoxConfig {
  readonly server: FuseBoxServerConfig
  readonly browser: FuseBoxBrowserConfig
  readonly verbose: boolean
}

export interface FusingAngularConfig {
  readonly favicon: FaviconConfig
  readonly fusebox: FuseBoxConfig
}

export default function readConfig_() {
  return readFile_(configPath).pipe(
    map<Buffer, any>(file => JSON.parse(file.toString())),
    map<any, FusingAngularConfig>(obj => obj), // TODO: add validation handler here
    catchError(err => {
      throw new Error(
        'Could not find fusing-angular.json configuration file.\nTry running "fng create" and creating a new application first.'
      )
    })
  )
}
