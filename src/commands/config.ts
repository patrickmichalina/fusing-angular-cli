import { command } from 'yargs'
import { take, tap } from 'rxjs/operators'
import {
  logInfoWithBackground,
  logPrettyJson,
  logError
} from '../utilities/log'
import readConfig_ from '../utilities/read-config'

command(
  'config',
  'show CLI configuration',
  args => {
    return args
  },
  args => {
    config()
  }
)

function displayMessage() {
  logInfoWithBackground('Viewing CLI configuration\n')
}

function config() {
  readConfig_()
    .pipe(
      tap(displayMessage),
      take(1)
    )
    .subscribe(logPrettyJson, logError)
}
