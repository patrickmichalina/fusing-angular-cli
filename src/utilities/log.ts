import chalk from 'chalk'

export const log = console.log

export function logPrettyJson(json?: Object) {
  log(JSON.stringify(json, undefined, 2))
}

export function logError(msg: any) {
  log(chalk.bgRedBright(msg))
}

export function logErrorWithPrefix(msg: any) {
  log(chalk.bgRedBright(`Error: ${msg}`))
}

export function logInfo(msg: any) {
  log(chalk.blue(msg))
}

export function logInfoWithBackground(msg: string) {
  log(chalk.bgBlue(msg))
}

export function logFileCreated(path: string) {
  logInfo(`File created/updated at ${path}`)
}
