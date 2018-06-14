import { writeFile, readFile, lstat, mkdir, mkdirSync } from 'fs'
import { bindNodeCallback, of, forkJoin, Observable } from 'rxjs'
import { tap, catchError, map, flatMap } from 'rxjs/operators'
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

interface PathModel {
  readonly doesNotExist: boolean
  readonly exists: boolean
  readonly path: string
}

function mapPathExistenceToObs(path: string) {
  return pathExists_(path).pipe(
    map<boolean, PathModel>(exists => {
      return {
        doesNotExist: !exists,
        exists,
        path
      }
    })
  )
}

function filterOnlyNonExistingFolders(list: ReadonlyArray<PathModel>) {
  return list.filter(a => a.doesNotExist)
}

function reducePathModelToPath(list: ReadonlyArray<PathModel>) {
  return list.map(b => b.path)
}

export function pathExistsDeep_(path: string) {
  const paths_ = path
    .split('/')
    .reduce(relativePathsToResolvedPaths, [])
    .map(mapPathExistenceToObs)

  return forkJoin(paths_).pipe(
    map(filterOnlyNonExistingFolders),
    map(reducePathModelToPath)
  )
}

export function mkDir_(path: string) {
  return bindNodeCallback(mkdir)(path)
}

export function mkDirAndContinueIfExists_(path: string) {
  return mkDir_(path).pipe(
    catchError(
      err =>
        err.errno === -17
          ? of(undefined)
          : (() => {
              throw err
            })()
    )
  )
}

export function mkDirDeep_(path: string): Observable<any> {
  return pathExistsDeep_(path).pipe(map(a => a.map(b => mkdirSync(b))))
}
