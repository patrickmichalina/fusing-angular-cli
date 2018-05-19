import clearTerminal from './clear'
import { log } from './log'
import * as splash from './.splash.txt'

export default function welcome() {
  clearTerminal()
  log(splash)
  return splash
}
