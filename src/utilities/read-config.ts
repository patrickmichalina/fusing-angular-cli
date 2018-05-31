import { empty } from 'rxjs'
import { logError } from './log'
import { map, catchError } from 'rxjs/operators'
import { readFile_ } from './rx-fs'

const configPath = 'fusing-angular.json'

interface FusingAngularConfig {
  readonly favicon: Object
}

export default function readConfig_() {
  return readFile_(configPath).pipe(
    map<Buffer, any>(file => JSON.parse(file.toString())),
    map<any, FusingAngularConfig>(obj => {
      return {
        ...obj
      }
    }),
    catchError(err => {
      logError(
        'Could not find fusing-angular.json configuration file.\nTry running "fng create" and creating a new application first.'
      )
      return empty()
    })
  )
}
