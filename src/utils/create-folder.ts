import { lstat, mkdir } from "fs/promises"
import { logError, log } from './log'

export default function createFolder (dirPath: string) {
  return lstat(dirPath)
    .then(stats => {
      logError(`\nDirectory ${dirPath} alreay exists\n`)
    })
    .catch(err => {
      return mkdir(dirPath)
        .then(() => {
          log('success!')
        })
        .catch(err => {
          log(err)
        })
    })
}

