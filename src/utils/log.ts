import chalk from "chalk"

export const log = console.log

export function logError (msg: string) {
  log(chalk.bgRedBright(msg))
}