import { writeJsonFile_ } from '../utilities/rx-fs'
import { resolve } from 'path'

interface npmPackageConfig {
  readonly name: string
  readonly description: string
  readonly license?: string
  readonly nodeVersionRange?: string
  readonly npmVersionRange?: string
  readonly dependencies: ReadonlyArray<string>
  readonly devDependencies: ReadonlyArray<string>
}

export default function (path = 'package.json', config: npmPackageConfig) {
  return writeJsonFile_(resolve(path), config)
}