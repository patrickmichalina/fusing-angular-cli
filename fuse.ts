import { FuseBox, QuantumPlugin, Bundle, JSONPlugin, RawPlugin } from 'fuse-box'
import { writeFileSync, chmodSync } from 'fs'
import { resolve } from 'path'
import { argv } from 'yargs'

const appName = 'fng'
const outputDir = '.build'
const homeDir = './'
const outputPath = `${outputDir}/${appName}`
const isProdBuild = argv.build

const shabang = (bundle: Bundle) => {
  const sheBang = '#!/usr/bin/env node'
  const final = `${sheBang}\n${bundle.generatedCode.toString()}`
  const path = resolve(outputPath)
  writeFileSync(path, final)
  chmodSync(path, '755')
}

const fuse = FuseBox.init({
  cache: !isProdBuild,
  target: 'server@es5',
  homeDir,
  output: `${outputDir}/$name`,
  globals: {
    default: '*'
  },
  package: {
    name: 'default',
    main: outputPath
  },
  plugins: [
    JSONPlugin(),
    RawPlugin([".txt"]),
    isProdBuild && QuantumPlugin({
      bakeApiIntoBundle: appName,
      treeshake: true,
      uglify: true
    })
  ]
})

const bundle = fuse.bundle(appName)
!isProdBuild && bundle.watch(`src/**`).completed(fp => shabang(fp.bundle))
bundle.instructions('> [src/index.ts]')

fuse.run().then(bp => {
  const bundle = bp.bundles.get(appName)
  bundle && shabang(bundle)
})