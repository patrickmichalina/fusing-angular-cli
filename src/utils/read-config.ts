import { readFile } from 'fs'
import { bindNodeCallback, of } from 'rxjs'
import { logError } from './log'
import { resolve } from 'path'
import { map, catchError } from 'rxjs/operators'

const configPath = 'fusing-angular.json'

interface FusingAngularConfig {
  readonly favicon: any
}

export default function readConfig() {
  return bindNodeCallback(readFile)(resolve(configPath))
    .pipe(
      map<Buffer, FusingAngularConfig | undefined>(file => JSON.parse(file.toString())),
      catchError(err => {
        logError('Could not find fusing-angular.json configuration file.')
        logError('Try running "fng create" and creating a new application first.')
        return of(undefined)
      })
    )
}