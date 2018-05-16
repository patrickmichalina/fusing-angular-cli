import { command } from 'yargs'
import favicon from '../commands/favicon'

command('favicon', 'generate favicons', (args) => {
  return args
}, (args) => {
  favicon()
})