import { Plugin, BundleProducer } from 'fuse-box'
import { gzipSync } from 'zlib'

// tslint:disable:no-class
// tslint:disable:no-this
// tslint:disable:no-if-statement
// tslint:disable:no-object-mutation
// tslint:disable:readonly-keyword
const defaults: GzipPluginOptions = {
  enabled: true
}

export interface GzipPluginOptions {
  enabled?: boolean
  fileTest?: string
}

export class GzipPluginClass implements Plugin {
  constructor(public opts: GzipPluginOptions = defaults) {
    this.opts = {
      ...defaults,
      ...opts
    }
  }
  producerEnd?(producer: BundleProducer): any {
    return Promise.all(
      Array.from(producer.bundles).map(bundle => {
        const zipThis = bundle[1].context.source.getResult().content
        const zipped = gzipSync(zipThis, { level: 9 })
        return bundle[1].context.output.writeCurrent(zipped)
      })
    )
  }
}

export const GzipPlugin = (options?: GzipPluginOptions) =>
  new GzipPluginClass(options)
