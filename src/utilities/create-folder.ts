import { logError, log, logFileCreated } from './log'
import { catchError, tap, take, flatMap } from 'rxjs/operators'
import { pathExists_, mkDir_ } from './rx-fs'
import { empty } from 'rxjs'

function handleFileCollision(dirPath: string) {
  logError(`\nDirectory ${dirPath} alreay exists\n`)
  return empty()
}

function handleCreation(dirPath: string) {
  return mkDir_(dirPath)
    .pipe(
      catchError(err => {
        log(err)
        throw new Error(err)
      }),
      tap(() => logFileCreated(dirPath))
    )
}

export default function createFolder(dirPath: string) {
  return pathExists_(dirPath)
    .pipe(
      flatMap(exists => {
        return exists
          ? handleFileCollision(dirPath)
          : handleCreation(dirPath)
      }),
      take(1)
    )
}

