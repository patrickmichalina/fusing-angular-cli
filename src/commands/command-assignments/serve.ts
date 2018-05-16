import serve from '../commands/serve'
import { command } from 'yargs'

command('serve [port]', 'serve your application', (args) => {
  return args
}, (args) => {
  serve()
})
.option('port', {
  alias: 'p',
  default: 5000,
  description: 'Http server port number'
})