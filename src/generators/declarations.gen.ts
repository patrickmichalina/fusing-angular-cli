import { writeFile_, writeFileSafely_ } from '../utilities/rx-fs'
import { resolve } from 'path'
import * as declarations from '../templates/declarations.ts.txt'

const configPath = 'declarations.d.ts'

export default function generateTsDeclartionFile(
  dir: string,
  overwrite = false
) {
  return overwrite
    ? writeFile_(resolve(dir, configPath), declarations)
    : writeFileSafely_(resolve(dir, configPath), declarations)
}
