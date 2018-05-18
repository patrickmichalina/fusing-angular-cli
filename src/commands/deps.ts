import { table } from 'table'
import { log } from '../utilities/log'
import * as pkg from '../../package.json'

function createTableString () {
  const deps = pkg.dependencies as { readonly [key: string]: string }
  const depsOfNote: ReadonlyArray<any> = ['fuse-box', 'rxjs', 'ts-node', 'typesciprt']
  const rows = Object.keys(deps)
    .filter(k => depsOfNote.some(b => b ===k))
    .map(k => {
    return [k, deps[k]]
  })
  return table([...rows])
}

export default function () {
  log('Dependencies')
  log(createTableString())
}