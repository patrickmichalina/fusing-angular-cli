import { writeFile_, writeFileSafely_ } from '../utilities/rx-fs'
import { resolve } from 'path'
import * as tsconfig from '../templates/tsconfig.json.txt'

const configPath = 'tsconfig.json'

export default function generateTsConfig(dir: string, overwrite = false) {
  return overwrite
    ? writeFile_(resolve(dir, configPath), tsconfig)
    : writeFileSafely_(resolve(dir, configPath), tsconfig)
}
