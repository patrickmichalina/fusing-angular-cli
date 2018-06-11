import { writeFile, readFile, lstat, mkdir } from 'fs'
import {
  bindNodeCallback,
  of,
  forkJoin,
  concat,
  empty,
  zip,
  Observable
} from 'rxjs'
import {
  tap,
  catchError,
  map,
  flatMap,
  throttleTime,
  concatAll
} from 'rxjs/operators'
import { logError, logFileCreated } from './log'
import { resolve } from 'path'

function returnTrue() {
  return true
}

function returnFalse_() {
  return of(false)
}

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
    map(returnTrue),
    catchError(returnFalse_)
  )
}

function relativePathsToResolvedPaths(
  acc: ReadonlyArray<string>,
  curr: string,
  idx: number
) {
  return [...acc, idx === 0 ? resolve(curr) : resolve(acc[idx - 1], curr)]
}

function mapPathExistenceToObs(path: string) {
  return pathExists_(path).pipe(
    map(exists => {
      return {
        doesNotExist: !exists,
        exists,
        path
      }
    })
  )
}

export function pathExistsDeep_(path: string) {
  const paths_ = path
    .split('/')
    .reduce(relativePathsToResolvedPaths, [])
    .map(mapPathExistenceToObs)

  return forkJoin(paths_).pipe(
    map(a => a.filter(c => c.doesNotExist)),
    map(a => a.map(b => b.path))
  )
}

export function mkDir_(path: string) {
  return bindNodeCallback(mkdir)(path)
}

export function mkDirDeep_(path: string): Observable<void> {
  return pathExistsDeep_(path).pipe(
    map(paths => paths.map(mkDir_)),
    concatAll()
    // flatMap(pathObs => {
    //   return concat(...pathObs).pipe(tap(console.log))
    // })
  )
}
