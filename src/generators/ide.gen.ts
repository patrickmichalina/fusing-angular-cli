import { IDE } from '../commands/create'
import { empty } from 'rxjs'
import { resolve } from 'path'
import {
  writeFileSafely_,
  writeFile_,
  mkDirAndContinueIfExists_
} from '../utilities/rx-fs'
import { flatMap } from 'rxjs/operators'
import * as vsCodeSettings from '../templates/vscode/settings.json.txt'
import * as vsCodeLaunch from '../templates/vscode/launch.json.txt'

const configPath = '.vscode/settings.json'
const launchPath = '.vscode/launch.json'
const dirRoot = '.vscode'

function handleOther() {
  return empty()
}

function handleVSCode(dir: string, overwrite = false) {
  return overwrite
    ? mkDirAndContinueIfExists_(resolve(dir, dirRoot)).pipe(
        flatMap(() => writeFile_(resolve(dir, configPath), vsCodeSettings)),
        flatMap(() => writeFile_(resolve(dir, launchPath), vsCodeLaunch))
      )
    : mkDirAndContinueIfExists_(resolve(dir, dirRoot)).pipe(
        flatMap(() =>
          writeFileSafely_(resolve(dir, configPath), vsCodeSettings)
        ),
        flatMap(() => writeFileSafely_(resolve(dir, launchPath), vsCodeLaunch))
      )
}

export default function generateIdeStubs(
  ide: IDE,
  dir: string,
  overwrite = false
) {
  switch (ide) {
    case IDE.OTHER:
      return handleOther()
    case IDE.VISUAL_STUDIO_CODE:
      return handleVSCode(dir, overwrite)
    default:
      return empty()
  }
}
