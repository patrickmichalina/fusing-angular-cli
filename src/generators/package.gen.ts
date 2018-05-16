import { writeJsonFile_ } from '../utilities/rx-fs'
import { resolve } from 'path'

interface StringDictionary {
  readonly [key: string]: string
}

interface npmPackageConfig {
  readonly name: string
  readonly description?: string
  readonly license?: string
  readonly nodeVersionRange?: string
  readonly npmVersionRange?: string
  readonly dependencies?: StringDictionary
  readonly devDependencies?: StringDictionary
}

export default function generatePackageFile(config: npmPackageConfig, dirPath = '', filename = 'package.json') {
  const _config: npmPackageConfig = {
    dependencies: {},
    devDependencies: {},
    ...config
  }
  return writeJsonFile_(resolve(dirPath, filename), _config)
}