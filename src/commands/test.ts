import { command } from 'yargs'
import { resolve } from 'path'
const jest = require('jest')

command(
  'test [--watch] [--watchAll]',
  'run unit-tests on your project',
  args => {
    return args
  },
  args => {
    const watch = args.watch || false
    const watchAll = args.watchAll || false
    test(watch, watchAll)
  }
)
  .option('watch', {
    default: false,
    description: 're-run tests when files change'
  })
  .option('watchAll', {
    default: false,
    description: 're-run tests when files change regardless of git diff'
  })

function test(watch: boolean, watchAll: boolean) {
  jest.runCLI(
    {
      watch,
      watchAll,
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
