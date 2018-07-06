import { writeJsonFile_ } from '../utilities/rx-fs'
import { resolve } from 'path'

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
  const config: npmPackageConfig = {
    version: '0.0.0',
    license: 'UNLICENSED',
    description: 'Angular app scaffolded by Fusing-Angular-CLI',
    ..._config,
    dependencies: {
      'fusing-angular-cli': '^0.2.x'
    }
  }
  return writeJsonFile_(
    resolve(dirPath, filename),
    sortStringDict(config as StringDictionary),
    overwrite
  )
}
