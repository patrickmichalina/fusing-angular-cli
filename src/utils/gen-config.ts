import { writeJsonFile_ } from './rx-fs'

const configPath = 'fusing-angular.json'

export function writeConfig() {
  return writeJsonFile_(configPath, {
    version: '0.0.12',
    test: 1
  })
}