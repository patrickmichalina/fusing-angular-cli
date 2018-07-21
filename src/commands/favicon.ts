import { command } from 'yargs'
import { logInfoWithBackground, logError } from '../utilities/log'
import { flatMap, map, filter, tap, take, first } from 'rxjs/operators'
import { rxFavicons } from '../utilities/rx-favicon'
import {
  writeFile_,
  writeJsonFile_,
  mkDirAndContinueIfExists_
} from '../utilities/rx-fs'
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
    favicon_('.')
      .pipe(
        first(),
        take(1)
      )
      .subscribe(logFaviconComplete, logError)
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

function mapResponsesToWriteableObservables(baseDir = '') {
  return function(response: configModel) {
    return readConfig_(baseDir).pipe(
      map(config => {
        return {
          ...config,
          generatedMetaTags: response.result.html
        }
      }),
      flatMap(config =>
        writeJsonFile_(resolve(baseDir, 'fusing-angular.json'), config, true)
      ),
      flatMap(() =>
        mkDirAndContinueIfExists_(resolve(baseDir, `${response.config.output}`))
      ),
      flatMap(() => {
        return forkJoin([
          ...response.result.files.map(file =>
            writeFile_(
              resolve(baseDir, `${response.config.output}/${file.name}`),
              file.contents
            )
          ),
          ...response.result.images.map(file =>
            writeFile_(
              resolve(baseDir, `${response.config.output}/${file.name}`),
              file.contents
            )
          )
        ])
      })
    )
  }
}

export function favicon_(path?: string) {
  return readConfig_(path).pipe(
    tap(logFaviconStart),
    filter(requireFaviconConfig),
    map(mapFaviconConfig),
    flatMap(rxFavicons(path), (config: FaviconConfig, result) => ({
      config,
      result
    })),
    tap(logDirectoryCheck),
    // flatMap(
    //   response => mkDirDeep_(resolve(path || '', response.config.output)),
    //   response => ({ ...response })
    // ),
    flatMap(mapResponsesToWriteableObservables(path))
  )
}
