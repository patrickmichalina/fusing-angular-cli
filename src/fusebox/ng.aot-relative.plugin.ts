import { Plugin, File } from 'fuse-box'

// tslint:disable:no-class
// tslint:disable:no-this
// tslint:disable:no-if-statement
// tslint:disable:no-object-mutation
// tslint:disable:readonly-keyword
export interface NgAotRelativePluginOptions {
  overwriteDict: Dict
}

interface Dict {
  [key: string]: string
}

function fromKeyValToSearchReplaceObject(obj: Dict) {
  return function(key: string) {
    return {
      search: new RegExp(key, 'g'),
      replace: `"fusing-angular-cli/.build/modules/src/modules/${obj[key]}"`
    }
  }
}

export class NgAotRelativePluginClass implements Plugin {
  constructor(public opts: Dict = {}) {}

  public test: RegExp = /.js/

  onTypescriptTransform?(file: File) {
    Object.keys(this.opts)
      .map(fromKeyValToSearchReplaceObject(this.opts))
      .filter(a => a.search.test(file.contents))
      .forEach(a => {
        file.contents = file.contents.replace(a.search, a.replace)
      })
  }
}

export const NgAotRelativePlugin = (dict?: Dict) =>
  new NgAotRelativePluginClass(dict)
