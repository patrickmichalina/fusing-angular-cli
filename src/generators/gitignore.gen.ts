
import { writeFileSafely_ } from '../utilities/rx-fs'
import { resolve } from 'path'
import * as gitignore from '../templates/gitignore.txt'

const configPath = '.gitignore'

export default function generateGitIgnore(dir: string) {
  return writeFileSafely_(resolve(dir, configPath), gitignore)
}