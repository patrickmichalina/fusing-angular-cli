import { command } from 'yargs'
import { logInfoWithBackground, logError, logInfo } from '../utilities/log'
import { flatMap, map, first } from 'rxjs/operators'
import { rxFavicons } from '../utilities/rx-favicon'
import readConfig_, { FaviconConfig } from '../utilities/read-config'
import { writeFile_, mkDirDeep_ } from '../utilities/rx-fs'
import { resolve } from 'path'
import { forkJoin } from 'rxjs'

command(
  'favicon',
  'generate favicons',
  args => {
    return args
  },
  args => {
    favicon()
  }
)

function favicon() {
  logInfoWithBackground('Generating Favicons...')

  readConfig_()
    .pipe(
      map(a => a.favicon),
      flatMap(rxFavicons, (config: FaviconConfig, result) => ({
        config,
        result
      })),
      flatMap(
        response => mkDirDeep_(response.config.output),
        response => ({ ...response })
      ),
      // map(response => response.result.images.map(file => writeFile_(resolve(`${response.config.output}/${file.name}`), file.contents))),
      // flatMap(fileWriteObs => forkJoin(fileWriteObs)),
      first()
    )
    .subscribe(undefined, logError)
}
