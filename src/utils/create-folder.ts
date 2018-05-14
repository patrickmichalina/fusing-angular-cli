import { logError, log } from './log'
import { bindNodeCallback } from 'rxjs'
import { catchError, tap, take } from 'rxjs/operators'
import { lstat, mkdir } from 'fs'

export default function createFolder(dirPath: string) {
  return bindNodeCallback(lstat)(dirPath)
    .pipe(
      tap(stats => logError(`\nDirectory ${dirPath} alreay exists\n`)),
      catchError(err => bindNodeCallback(mkdir)(dirPath)
        .pipe(
          catchError(err => {
            log(err)
            throw new Error(err)
          }),
          tap(() => log('success!'))
        )
      ),
      take(1)
    )
}

