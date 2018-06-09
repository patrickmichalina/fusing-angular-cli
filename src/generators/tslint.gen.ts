import { writeFileSafely_ } from '../utilities/rx-fs'
import { resolve } from 'path'
import * as tslint from '../templates/tslint.json.txt'

const configPath = 'tslint.json'

export default function generateTsLint(dir: string) {
  return writeFileSafely_(resolve(dir, configPath), tslint)
}
