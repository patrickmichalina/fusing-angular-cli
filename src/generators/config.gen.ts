import { writeJsonFile_ } from '../utilities/rx-fs'
import { resolve } from 'path'

const configPath = 'fusing-angular.json'

export default function generateFngConfig(path: string) {
  return writeJsonFile_(resolve(path, configPath), {
    version: '0.0.12',
    test: 1
  })
}