import { command } from 'yargs'
import { logInfoWithBackground } from '../utilities/log'
import { take } from 'rxjs/operators'
import { Observable } from 'rxjs'
import readConfig_ from '../utilities/read-config'

command(
  'favicon',
  'generate favicons',
  args => {
    return args
  },
  args => {
    favicon(readConfig_)
  }
)

function favicon(generator: () => Observable<any>) {
  logInfoWithBackground('Generating Favicons...')
  generator()
    .pipe(take(1))
    .subscribe(console.log)
}
