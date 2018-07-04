import { writeFileSafely_, writeFile_ } from '../utilities/rx-fs'
import { resolve } from 'path'
import * as env from '../templates/env.txt'

const configPath = '.env'

export default function generateDotEnv(dir: string, overwrite = false) {
  return overwrite
    ? writeFile_(resolve(dir, configPath), env)
    : writeFileSafely_(resolve(dir, configPath), env)
}
