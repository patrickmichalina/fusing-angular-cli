import { command } from 'yargs'

command('build', 'build your application', (args) => {
  return args
}, (args) => {
  build()
})

function build() {
  console.log('Launching Init Command')
}