import { command } from 'yargs'
import { logInfo } from '../utilities/log'
import { serve } from './serve'

command(
  'build [prod][sw]',
  'build your application',
  args => {
    return args
  },
  args => {
    logInfo('Launching Init Command')
    serve(args.prod, args.sw, true)
  }
)
  .option('prod', {
    default: false,
    description: 'Run with optimizations enabled'
  })
  .option('sw', {
    default: false,
    description: 'Enable service-worker'
  })
