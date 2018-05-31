import { command } from 'yargs'
import { take } from 'rxjs/operators'
import { logInfoWithBackground, logPrettyJson } from '../utilities/log'
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

function config() {
  logInfoWithBackground('Viewing CLI configuration\n')
  readConfig_()
    .pipe(take(1))
    .subscribe(logPrettyJson)
}
