import { FuseBox, QuantumPlugin, JSONPlugin, RawPlugin, Sparky } from 'fuse-box'
import { resolve } from 'path'
import { argv } from 'yargs'
import shabang from './tools/scripts/fuse-shebang'

const appName = 'fng'
const outputDir = '.build'
const homeDir = './'
const outputPath = `${outputDir}/${appName}`
const absOutputPath = resolve(outputPath)
const isProdBuild = argv.build

const fuseConfig = FuseBox.init({
  log: false,
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
    RawPlugin(['.txt']),
    isProdBuild &&
      QuantumPlugin({
        bakeApiIntoBundle: appName,
        treeshake: true,
        uglify: true
      })
  ]
})

const bundle = fuseConfig.bundle(appName)

Sparky.task('test', () => {
  bundle.test('[spec/**/**.ts]', {})
})

Sparky.task('default', () => {
  !isProdBuild &&
    bundle.watch(`src/**`).completed(fp => shabang(fp.bundle, absOutputPath))
  bundle.instructions('> [src/index.ts]')

  fuseConfig.run().then(bp => {
    const bundle = bp.bundles.get(appName)
    bundle && shabang(bundle, absOutputPath)
  })
})
