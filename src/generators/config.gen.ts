import { writeJsonFile_ } from '../utilities/rx-fs'
import { resolve } from 'path'
import { FAVICON_DEFAULTS as favicon } from '../templates/favicon'
import { FUSEBOX_DEFAULTS as fusebox } from '../templates/fusebox'

const configPath = 'fusing-angular.json'

export default function generateFngConfig(
  path: string,
  overwrite = false,
  faviconOverride?: any
) {
  return writeJsonFile_(
    resolve(path, configPath),
    {
      favicon: {
        ...favicon,
        ...faviconOverride
      },
      fusebox
    },
    overwrite
  )
}
