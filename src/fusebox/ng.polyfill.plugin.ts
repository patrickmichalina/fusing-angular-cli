import { Plugin, File } from 'fuse-box'

// tslint:disable:no-class
// tslint:disable:no-this
// tslint:disable:no-if-statement
// tslint:disable:no-object-mutation
// tslint:disable:readonly-keyword

const defaults: NgPolyfillPluginOptions = {}

export interface NgPolyfillPluginOptions {
  isServer?: boolean
  fileTest?: string
}

export const NG_POLY_BASE: ReadonlyArray<any> = ['core-js/es7/reflect']
export const NG_POLY_SERVER: ReadonlyArray<any> = [
  ...NG_POLY_BASE,
  'zone.js/dist/zone-node',
  'zone.js/dist/long-stack-trace-zone'
]
export const NG_POLY_BROWSER_IE: ReadonlyArray<any> = [
  'core-js/es6/symbol',
  'core-js/es6/object',
  'core-js/es6/function',
  'core-js/es6/parse-int',
  'core-js/es6/parse-float',
  'core-js/es6/number',
  'core-js/es6/math',
  'core-js/es6/string',
  'core-js/es6/date',
  'core-js/es6/array',
  'core-js/es6/regexp',
  'core-js/es6/map',
  'core-js/es6/weak-map',
  'core-js/es6/set'
]
export const NG_POLY_BROWSER: ReadonlyArray<any> = [
  ...NG_POLY_BASE,
  ...NG_POLY_BROWSER_IE,
  'zone.js/dist/zone'
]
export const NG_POLY_BROWSER_IE_ANIMATIONS: ReadonlyArray<any> = [
  'web-animations-js'
]

const prepForTransform = (deps: ReadonlyArray<string>) => {
  return deps
    .map(dep => {
      return `import '${dep}'`
    })
    .join('\n')
}

export class NgPolyfillPluginClass implements Plugin {
  constructor(private opts: NgPolyfillPluginOptions = defaults) {}
  public test: RegExp =
    (this.opts.fileTest && new RegExp(this.opts.fileTest)) ||
    /(app.browser.module.ts)/
  public dependencies: ['zone.js', 'core-js']

  onTypescriptTransform(file: File) {
    if (!this.test.test(file.relativePath)) return
    file.contents = `${prepForTransform(this.buildSet())}\n${file.contents}`
  }

  buildSet() {
    if (this.opts.isServer) {
      return NG_POLY_SERVER
    } else {
      return NG_POLY_BROWSER
    }
  }
}

export const NgPolyfillPlugin = (options?: NgPolyfillPluginOptions) =>
  new NgPolyfillPluginClass(options)
