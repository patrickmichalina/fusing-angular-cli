import {
  appModuleTemplate,
  appComponentTemplate,
  appRoutingModuleTemplate,
  appSharedModuleTemplate
} from '../templates/core/app'
import { writeFile_, mkDirAndContinueIfExists_ } from '../utilities/rx-fs'
import { forkJoin } from 'rxjs'
import { resolve } from 'path'
import { flatMap } from 'rxjs/operators'
import {
  browserModuleTemplate,
  browserAotEntryTemplate,
  browserJitEntryTemplate
} from '../templates/core/browser'
import {
  serverTemplate,
  serverModuleTemplate,
  serverAppTemplate
} from '../templates/core/server'

export function generateCoreAngular(projectDir: string) {
  return forkJoin([
    generateCoreAngularApp(projectDir),
    generateCoreAngularBrowser(projectDir),
    generateCoreAngularServer(projectDir)
  ])
}

export function generateCoreAngularApp(projectDir: string, universal = true) {
  const root = resolve(`${projectDir}/src`)
  const baseDir = resolve(root, 'app')

  const appModulePrepped = appModuleTemplate
    .replace(
      /^.*#TransferHttpCacheModuleImport.*$/gm,
      universal
        ? "import { TransferHttpCacheModule } from '@nguniversal/common'"
        : ''
    )
    .replace(
      /^.*#TransferHttpCacheModule.*$/gm,
      universal ? '\u0020\u0020\u0020\u0020TransferHttpCacheModule,' : ''
    )

  return mkDirAndContinueIfExists_(root).pipe(
    flatMap(() => mkDirAndContinueIfExists_(baseDir)),
    flatMap(() =>
      forkJoin([
        writeFile_(`${baseDir}/app.module.ts`, appModulePrepped),
        writeFile_(`${baseDir}/app.shared.module.ts`, appSharedModuleTemplate),
        writeFile_(
          `${baseDir}/app.routing.module.ts`,
          appRoutingModuleTemplate
        ),
        writeFile_(`${baseDir}/app.component.ts`, appComponentTemplate)
      ])
    )
  )
}

export function generateCoreAngularBrowser(projectDir: string) {
  const root = resolve(`${projectDir}/src`)
  const baseDir = resolve(root, 'browser')
  return mkDirAndContinueIfExists_(root).pipe(
    flatMap(() => mkDirAndContinueIfExists_(baseDir)),
    flatMap(() =>
      forkJoin([
        writeFile_(`${baseDir}/app.browser.module.ts`, browserModuleTemplate),
        writeFile_(
          `${baseDir}/app.browser.entry.jit.ts`,
          browserJitEntryTemplate
        ),
        writeFile_(
          `${baseDir}/app.browser.entry.aot.ts`,
          browserAotEntryTemplate
        )
      ])
    )
  )
}

export function generateCoreAngularServer(projectDir: string) {
  const root = resolve(`${projectDir}/src`)
  const baseDir = resolve(root, 'server')
  return mkDirAndContinueIfExists_(root).pipe(
    flatMap(() => mkDirAndContinueIfExists_(baseDir)),
    flatMap(() =>
      forkJoin([
        writeFile_(`${baseDir}/server.angular.module.ts`, serverModuleTemplate),
        writeFile_(`${baseDir}/server.app.ts`, serverAppTemplate),
        writeFile_(`${baseDir}/server.ts`, serverTemplate)
      ])
    )
  )
}
