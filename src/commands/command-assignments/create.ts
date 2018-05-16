import { command } from 'yargs'
import create from '../commands/create'

command('create', 'create a new application', (args) => {
  return args
}, (args) => {
  create()
})