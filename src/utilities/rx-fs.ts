import { writeFile, readFile, lstat, mkdir } from 'fs'
import { bindNodeCallback } from 'rxjs'

export function writeFile_(path: string, data: any) {
  return bindNodeCallback(writeFile)(path, data)
}

export function writeJsonFile_(path: string, obj: Object) {
  return writeFile_(path, JSON.stringify(obj, undefined, 2))
}

export function readFile_ (path: string) {
  return bindNodeCallback(readFile)(path)
}

export function pathExists_ (path: string) {
  return bindNodeCallback(lstat)(path)
}

export function mkDir_ (path: string) {
  return bindNodeCallback(mkdir)(path)
}