import { File } from 'fuse-box/core/File'

// tslint:disable:no-class
// tslint:disable:no-this
// tslint:disable:no-if-statement
// tslint:disable:no-object-mutation
// tslint:disable:readonly-keyword

const defaults = {}

export interface NgSwPluginOptions {}

export class NgSwPluginClass {
  public test: RegExp = new RegExp('browser')

  constructor(public opts: NgSwPluginOptions = defaults) {}

  transform(file: File) {
    const regex = new RegExp(/enabled: false/, 'g')
    if (regex.test(file.contents)) {
      file.contents = file.contents.replace(regex, 'enabled: true')
    }
  }
}

export const NgSwPlugin = (options?: NgSwPluginOptions) =>
  new NgSwPluginClass(options)
