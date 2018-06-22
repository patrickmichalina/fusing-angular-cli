import { main as ngc } from '@angular/compiler-cli/src/main'
import { Plugin, File } from 'fuse-box'
import { resolve } from 'path'

// tslint:disable:no-class
// tslint:disable:no-this
// tslint:disable:no-if-statement
// tslint:disable:no-object-mutation
// tslint:disable:readonly-keyword
const defaults: NgcPluginOptions = {}

export interface NgcPluginOptions {
  enabled?: boolean
}

export class NgcPluginClass implements Plugin {
  constructor(private opts: NgcPluginOptions = defaults) {}
  public test: RegExp = /-routing.module.js/
  bundleStart() {
    this.opts.enabled && ngc(['-p', resolve('tsconfig.aot.json')])
  }

  transform(file: File) {
    const regex1 = new RegExp(/.module'/, 'g')
    const regex2 = new RegExp(/Module\);/, 'g')
    file.contents = file.contents.replace(regex1, ".module.ngfactory'")
    file.contents = file.contents.replace(regex2, 'ModuleNgFactory);')
  }
}

export const NgCompilerPlugin = (options?: NgcPluginOptions) =>
  new NgcPluginClass(options)
