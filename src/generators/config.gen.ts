import { writeJsonFile_ } from '../utilities/rx-fs'
import { resolve } from 'path'
import { FAVICON_DEFAULTS as favicon } from '../templates/favicon'

const configPath = 'fusing-angular.json'
const pkg = require(resolve('package.json'))

export default function generateFngConfig(path: string) {
  return writeJsonFile_(resolve(path, configPath), {
    version: pkg.version,
    favicon
  })
}
