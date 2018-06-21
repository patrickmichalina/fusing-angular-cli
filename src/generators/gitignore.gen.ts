import { writeFileSafely_, writeFile_ } from '../utilities/rx-fs'
import { resolve } from 'path'
import * as gitignore from '../templates/gitignore.txt'

const configPath = '.gitignore'

export default function generateGitIgnore(dir: string, overwrite = false) {
  return overwrite
    ? writeFile_(resolve(dir, configPath), gitignore)
    : writeFileSafely_(resolve(dir, configPath), gitignore)
}
