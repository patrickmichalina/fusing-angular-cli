import chalk from 'chalk'
import clearTerminal from './clear'
import { log } from './log'
import * as spash from "./.splash.txt"

export default function () {
  clearTerminal()
  log(spash)
  log(chalk.bgGreen('\nFusing Angular CLI\n\n'))
}