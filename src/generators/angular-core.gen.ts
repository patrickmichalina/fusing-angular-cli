import { appModuleTemplate, appComponentTemplate } from '../templates/core/app'
import { mkDir_, writeFile_ } from '../utilities/rx-fs'
import { forkJoin } from 'rxjs'
import { resolve } from 'path'
import { flatMap } from 'rxjs/operators'

export default function generateCoreAngular(projectDir: string) {
  const root = resolve(`${projectDir}/src`)
  const baseDir = resolve(root, 'app')
  return mkDir_(root)
    .pipe(
      flatMap(() => mkDir_(baseDir)),
      flatMap(() => forkJoin([
        writeFile_(`${baseDir}/app.module.ts`, appModuleTemplate),
        writeFile_(`${baseDir}/app.component.ts`, appComponentTemplate)
      ]))
    )
}