import { command } from 'yargs'
import { logInfoWithBackground, logError } from '../utilities/log'
import { flatMap, map, first, filter, tap } from 'rxjs/operators'
import { rxFavicons } from '../utilities/rx-favicon'
import { writeFile_, mkDirDeep_, writeJsonFile_ } from '../utilities/rx-fs'
import { resolve } from 'path'
import { forkJoin } from 'rxjs'
import readConfig_, {
  FaviconConfig,
  FusingAngularConfig
} from '../utilities/read-config'
import { FavIconResponse } from 'favicons'

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

function logFaviconStart() {
  logInfoWithBackground('Generating Favicons...')
}

function logDirectoryCheck() {
  logInfoWithBackground('Creating favicons directories...')
}

function logFaviconComplete() {
  logInfoWithBackground('Favicon generation complete!')
}

interface configModel {
  readonly config: FaviconConfig
  readonly result: FavIconResponse
}

function mapResponsesToWriteableObservables(response: configModel) {
  return readConfig_().pipe(
    flatMap(config => {
      const _confg = {
        ...config,
        generatedMetaTags: response.result.html
      }
      return writeJsonFile_(resolve('fusing-angular.json'), _confg, true)
    }),
    flatMap(() => {
      return forkJoin(
        ...response.result.files.map(file =>
          writeFile_(
            resolve(`${response.config.output}/${file.name}`),
            file.contents
          )
        )
      )
    }),
    map(() => {
      return response.result.images.map(file =>
        writeFile_(
          resolve(`${response.config.output}/${file.name}`),
          file.contents
        )
      )
    })
  )
}

function favicon() {
  readConfig_()
    .pipe(
      tap(logFaviconStart),
      filter(requireFaviconConfig),
      map(mapFaviconConfig),
      flatMap(rxFavicons, (config: FaviconConfig, result) => ({
        config,
        result
      })),
      tap(logDirectoryCheck),
      flatMap(
        response => mkDirDeep_(response.config.output),
        response => ({ ...response })
      ),
      map(mapResponsesToWriteableObservables),
      flatMap(fileWriteObs => forkJoin(fileWriteObs)),
      first()
    )
    .subscribe(logFaviconComplete, logError)
}
