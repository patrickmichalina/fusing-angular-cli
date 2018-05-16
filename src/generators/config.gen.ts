import { writeJsonFile_ } from '../utilities/rx-fs'

const configPath = 'fusing-angular.json'

export default function generate() {
  return writeJsonFile_(configPath, {
    version: '0.0.12',
    test: 1
  })
}