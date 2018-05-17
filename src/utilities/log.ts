import chalk from "chalk"

export const log = console.log

export function logError (msg: string) {
  log(chalk.bgRedBright(`Error: ${msg}`))
}

export function logInfo (msg: string) {
  log(chalk.blue(msg))
}

export function logFileCreated (path: string) {
  logInfo(`Created file at ${path}`)
}