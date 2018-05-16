import welcome from './utils/welcome'
import { writeConfig } from './utils/gen-config'
import readConfig from './utils/read-config'

welcome()

writeConfig().subscribe(() => {
  readConfig().subscribe(config => {
    console.log(config)
  })
})


import './cmds/command-assignments'


