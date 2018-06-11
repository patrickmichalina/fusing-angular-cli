import { command } from 'yargs'
import { logInfoWithBackground, logError, logInfo } from '../utilities/log'
import { flatMap, map, first, filter } from 'rxjs/operators'
import { rxFavicons } from '../utilities/rx-favicon'
import { writeFile_, mkDirDeep_ } from '../utilities/rx-fs'
import { resolve } from 'path'
import { forkJoin } from 'rxjs'
import readConfig_, {
  FaviconConfig,
  FusingAngularConfig
} from '../utilities/read-config'

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

function requireFaviconConfig(config: FusingAngularConfig) {
  return config && config.favicon
    ? true
    : (() => {
        throw new Error('Favicon configuration required.')
      })()
}

function mapFaviconConfig(config: FusingAngularConfig) {
  return config && config.favicon
}

function favicon() {
  logInfoWithBackground('Generating Favicons...')

  readConfig_()
    .pipe(
      filter(requireFaviconConfig),
      map(mapFaviconConfig),
      flatMap(rxFavicons, (config: FaviconConfig, result) => ({
        config,
        result
      })),
      flatMap(
        response => mkDirDeep_(response.config.output),
        response => ({ ...response })
      ),
      map(response =>
        response.result.images.map(file =>
          writeFile_(
            resolve(`${response.config.output}/${file.name}`),
            file.contents
          )
        )
      ),
      flatMap(fileWriteObs => forkJoin(fileWriteObs)),
      first()
    )
    .subscribe(logInfo, logError)
}
