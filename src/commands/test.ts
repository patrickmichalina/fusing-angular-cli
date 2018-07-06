import { command } from 'yargs'
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

function test() {
  jest.runCLI(
    {
      globals: JSON.stringify({
        __TRANSFORM_HTML__: true,
        'ts-jest': {
          tsConfigFile: resolve('tsconfig.json')
        }
      }),
      transform: JSON.stringify({
        '^.+\\.(ts|js|html)$': resolve(
          'node_modules/fusing-angular-cli/.build/jest/preprocessor.js'
        )
      }),
      testMatch: [
        '**/__tests__/**/*.+(ts|js)?(x)',
        '**/+(*.)+(spec|test).+(ts|js)?(x)'
      ],
      moduleFileExtensions: ['ts', 'js', 'html', 'json'],
      setupTestFrameworkScriptFile: resolve(
        'node_modules/fusing-angular-cli/.build/jest/jest.setup.js'
      ),
      snapshotSerializers: [
        resolve(
          'node_modules/fusing-angular-cli/.build/jest/AngularSnapshotSerializer.js'
        ),
        resolve(
          'node_modules/fusing-angular-cli/.build/jest/HTMLCommentSerializer.js'
        )
      ]
    },
    [resolve(__dirname, '../../')]
  )
}
