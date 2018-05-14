import clearTerminal from './clear'
import { log } from './log'
import * as spash from "./.splash.txt"

export default function () {
  clearTerminal()
  log(spash)
}