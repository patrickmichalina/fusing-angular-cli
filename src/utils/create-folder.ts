import { logError, log } from './log'
import { catchError, tap, take } from 'rxjs/operators'
import { pathExists_, mkDir_ } from './rx-fs'

export default function createFolder(dirPath: string) {
  return pathExists_(dirPath)
    .pipe(
      tap(stats => logError(`\nDirectory ${dirPath} alreay exists\n`)),
      catchError(err => mkDir_(dirPath)
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

