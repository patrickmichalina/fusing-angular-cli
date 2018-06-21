import { writeJsonFile_ } from '../utilities/rx-fs'
import { resolve } from 'path'
import { ANGULAR_CORE_DEPS } from './deps.const'

interface StringDictionary {
  readonly [key: string]: string
}

interface npmPackageConfig {
  readonly [key: string]: any
  readonly name: string
  readonly description?: string
  readonly license?: string
  readonly nodeVersionRange?: string
  readonly npmVersionRange?: string
  readonly version?: string
  readonly dependencies?: StringDictionary
  readonly devDependencies?: StringDictionary
}

function sortStringDict(dict: StringDictionary) {
  return Object.keys(dict)
    .sort()
    .reduce((acc, curr) => {
      return {
        ...acc,
        [curr]: dict[curr]
      }
    }, {})
}

export default function generatePackageFile(
  _config: npmPackageConfig,
  overwrite = false,
  dirPath = '',
  filename = 'package.json'
) {
  const deps: StringDictionary = {
    ...ANGULAR_CORE_DEPS
  }

  const devDeps: StringDictionary = {}

  const config: npmPackageConfig = {
    version: '0.0.0',
    license: 'UNLICENSED',
    description: 'Angular app scaffolded by Fusing-Angular-CLI',
    ..._config,
    dependencies: {
      ...sortStringDict({ ...(_config.dependencies || {}), ...deps })
    },
    devDependencies: {
      ...sortStringDict({ ...(_config.devDependencies || {}), ...devDeps })
    }
  }
  return writeJsonFile_(
    resolve(dirPath, filename),
    sortStringDict(config as StringDictionary),
    overwrite
  )
}
