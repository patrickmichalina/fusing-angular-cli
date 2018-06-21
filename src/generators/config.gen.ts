import { writeJsonFile_ } from '../utilities/rx-fs'
import { resolve } from 'path'
import { FAVICON_DEFAULTS as favicon } from '../templates/favicon'
import { FUSEBOX_DEFAULTS as fusebox } from '../templates/fusebox'

const configPath = 'fusing-angular.json'
const pkg = require(resolve('package.json'))

export default function generateFngConfig(path: string, overwrite = false) {
  return writeJsonFile_(
    resolve(path, configPath),
    {
      version: pkg.version,
      favicon,
      fusebox
    },
    overwrite
  )
}
