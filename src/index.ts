import welcome from './utils/welcome'

import readConfig from './utils/read-config'

welcome()

readConfig().subscribe(config => {
  console.log(config && config.favicon)
})


import './cmds/command-assignments'

