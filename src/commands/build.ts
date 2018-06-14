import { command } from 'yargs'
import { logInfo } from '../utilities/log'

command(
  'build',
  'build your application',
  args => {
    return args
  },
  args => {
    build()
  }
)

function build() {
  logInfo('Launching Init Command')
}
