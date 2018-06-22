import { writeFile_, writeFileSafely_ } from '../utilities/rx-fs'
import { resolve } from 'path'
import { forkJoin } from 'rxjs'
import * as tsconfig from '../templates/tsconfig.json.txt'
import * as aotTsconfig from '../templates/tsconfig.aot.json.txt'

const configPath = 'tsconfig.json'
const configPath2 = 'tsconfig.aot.json'

export default function generateTsConfig(dir: string, overwrite = false) {
  return overwrite
    ? forkJoin([
        writeFile_(resolve(dir, configPath), tsconfig),
        writeFile_(resolve(dir, configPath2), aotTsconfig)
      ])
    : forkJoin([
        writeFileSafely_(resolve(dir, configPath), tsconfig),
        writeFileSafely_(resolve(dir, configPath2), aotTsconfig)
      ])
}
