import { command } from 'yargs'
import { logInfo } from '../utilities/log'
import { resolve } from 'path'
const jest = require('jest')

command(
  'test',
  'run unit-tests on your project',
  args => {
    return args
  },
  args => {
    test()
  }
)
console.log(resolve('preprocessor.js'))
function test() {
  logInfo('Testing....')

  jest.runCLI(
    {
      transform: JSON.stringify({
        '^.+\\.(ts|js|html)$': resolve('testing/preprocessor.js')
      }),
      testMatch: [
        '**/__tests__/**/*.+(ts|js)?(x)',
        '**/+(*.)+(spec|test).+(ts|js)?(x)'
      ],
      moduleFileExtensions: ['ts', 'js', 'html', 'json'],
      setupTestFrameworkScriptFile: '<rootDir>/testing/jest.setup.js'
    },
    [resolve(__dirname, '../../')]
  )
}
