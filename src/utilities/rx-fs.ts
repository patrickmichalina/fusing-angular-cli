import { writeFile, readFile, lstat, mkdir } from 'fs'
import { bindNodeCallback, of } from 'rxjs'
import { tap, catchError, map, flatMap } from 'rxjs/operators'
import { logError, logFileCreated } from './log'

export function writeFileSafely_(path: string, data: any, overwrite = false) {
  return overwrite
    ? writeFile_(path, data)
    : pathExists_(path).pipe(
        flatMap(
          exists =>
            exists
              ? of(undefined).pipe(
                  tap(() => logError(`Path ${path} already exists`))
                )
              : writeFile_(path, data)
        )
      )
}

export function writeFile_(path: string, data: any) {
  return bindNodeCallback(writeFile)(path, data).pipe(
    tap(() => logFileCreated(path))
  )
}

export function writeJsonFile_(path: string, obj: Object, overwrite = false) {
  return writeFileSafely_(path, JSON.stringify(obj, undefined, 2), overwrite)
}

export function readFile_(path: string) {
  return bindNodeCallback(readFile)(path)
}

export function pathExists_(path: string) {
  return bindNodeCallback(lstat)(path).pipe(
    map(() => true),
    catchError(err => of(false))
  )
}

export function mkDir_(path: string) {
  return bindNodeCallback(mkdir)(path).pipe(catchError(() => of(undefined)))
}
