import { command } from 'yargs'
import { logInfo, logError } from '../utilities/log'
import { load, commands } from 'npm'

command(
  'update',
  'update the CLI to the latest version',
  args => {
    return args
  },
  args => {
    update()
  }
)

function update() {
  logInfo('Updating the CLI')
  load({ global: true }, () => {
    commands.install(['fusing-angular-cli@latest'], err => {
      err && logError(err)
    })
  })
}
