import { command } from 'yargs'

command('favicon', 'generate favicons', (args) => {
  return args
}, (args) => {
  favicon()
})
function favicon () {
  console.log('Launching FAVICON Command')
}