import { appModuleTemplate, appComponentTemplate } from '../templates/core/app'
import { mkDir_, writeFile_ } from '../utilities/rx-fs'
import { forkJoin } from 'rxjs'
import { resolve } from 'path'
import { flatMap } from 'rxjs/operators'
import { browserModuleTemplate } from '../templates/core/browser'
import { serverTemplate, serverModuleTemplate, serverAppTemplate } from '../templates/core/server'

export function generateCoreAngular(projectDir: string) {
  return forkJoin([
    generateCoreAngularApp(projectDir),
    generateCoreAngularBrowser(projectDir),
    generateCoreAngularServer(projectDir)
  ])
}


export function generateCoreAngularApp(projectDir: string) {
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

export function generateCoreAngularBrowser(projectDir: string) {
  const root = resolve(`${projectDir}/src`)
  const baseDir = resolve(root, 'browser')
  return mkDir_(root)
    .pipe(
      flatMap(() => mkDir_(baseDir)),
      flatMap(() => forkJoin([
        writeFile_(`${baseDir}/app.browser.module.ts`, browserModuleTemplate),
      ]))
    )
}

export function generateCoreAngularServer(projectDir: string) {
  const root = resolve(`${projectDir}/src`)
  const baseDir = resolve(root, 'server')
  return mkDir_(root)
    .pipe(
      flatMap(() => mkDir_(baseDir)),
      flatMap(() => forkJoin([
        writeFile_(`${baseDir}/server.angular.module.ts`, serverModuleTemplate),
        writeFile_(`${baseDir}/server.app.ts`, serverAppTemplate),
        writeFile_(`${baseDir}/server.ts`, serverTemplate)
      ]))
    )
}