import { command } from 'yargs'
import build from '../commands/build'

command('build', 'build your application', (args) => {
  return args
}, (args) => {
  build()
})