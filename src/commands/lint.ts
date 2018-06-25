import { command } from 'yargs'
import { logInfo, log } from '../utilities/log'
import { Linter, Configuration, ILinterOptions } from 'tslint'
import * as fs from 'fs'
import chalk from 'chalk'
import { resolve } from 'path'

const fileName = resolve('src/server/server.ts')
const configurationFilename = resolve('tslint.json')
const options: ILinterOptions = {
  fix: false,
  formatter: 'json'
}

const fileContents = fs.readFileSync(fileName, 'utf8')
const linter = new Linter(options)
const configuration = Configuration.findConfiguration(
  configurationFilename,
  fileName
).results
linter.lint(fileName, fileContents, configuration)

command(
  'lint',
  'check your code quality',
  args => {
    return args
  },
  args => {
    lint()
  }
)

function warnings(count: number) {
  const str = count.toString()
  return count > 0
    ? chalk.underline(chalk.bgYellow(`  ${str}  `))
    : chalk.underline(`  ${str}  `)
}

function errors(count: number) {
  const str = count.toString()
  return count > 0
    ? chalk.underline(chalk.bgRed(`  ${str}  `))
    : chalk.underline(`  ${str}  `)
}

function lint() {
  logInfo('Linter\n')
  const result = linter.getResult()
  log(`  Errors: `, errors(result.errorCount))
  log(`Warnings: `, warnings(result.warningCount), '\n')

  result.failures.map(obj => obj.toJson()).forEach(json => {
    log(
      `${json.ruleSeverity}(${json.ruleName}): ${json.name} (${
        json.startPosition.line
      }, ${json.startPosition.character}): ${json.failure}`
    )
  })

  log('\n')
}
