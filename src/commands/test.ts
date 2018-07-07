import { command } from 'yargs'
import { resolve } from 'path'
const jest = require('jest')

command(
  'test [--watch] [--coverage]',
  'run unit-tests on your project',
  args => {
    return args
  },
  args => {
    const watch = args.watch || false
    const coverage = args.coverage || false
    test(watch, coverage)
  }
)
  .option('coverage', {
    default: false,
    description: 'report on code coverage'
  })
  .option('watch', {
    default: false,
    description: 're-run tests when files change'
  })

function test(watchAll: boolean, coverage: boolean) {
  jest.runCLI(
    {
      watchAll,
      coverage,
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
      ],
      testResultsProcessor: resolve('node_modules/jest-junit-reporter'),
      collectCoverageFrom: [
        'src/**/*.{ts,html}',
        '!src/browser/app.browser.entry.aot.ts',
        '!src/browser/app.browser.entry.jit.ts'
      ]
    },
    [resolve(__dirname, '../../')]
  )
}
