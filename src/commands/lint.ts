import { command } from 'yargs'
import { logInfo, log, logError } from '../utilities/log'
import { Linter, Configuration, ILinterOptions } from 'tslint'
import { resolve } from 'path'
import { readFile_ } from '../utilities/rx-fs'
import { take } from 'rxjs/operators'
import chalk from 'chalk'

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

function showErrorLoadingProject() {
  logError('Could not load entry file, are you in a project directory?')
}

function lint() {
  const fileName = resolve('src/server/server.ts')
  const configurationFilename = resolve('tslint.json')
  const options: ILinterOptions = {
    fix: false,
    formatter: 'json'
  }

  readFile_(fileName)
    .pipe(take(1))
    .subscribe(fileContents => {
      const linter = new Linter(options)
      const configuration = Configuration.findConfiguration(
        configurationFilename,
        fileName
      ).results
      linter.lint(fileName, fileContents.toString(), configuration)

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
    }, showErrorLoadingProject)
}
