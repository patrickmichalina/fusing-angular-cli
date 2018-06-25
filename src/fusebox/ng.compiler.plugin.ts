import { main as ngc } from '@angular/compiler-cli/src/main'
import { Plugin } from 'fuse-box'
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

  bundleStart() {
    this.opts.enabled && ngc(['-p', resolve('tsconfig.aot.json')])
  }
}

export const NgCompilerPlugin = (options?: NgcPluginOptions) =>
  new NgcPluginClass(options)
