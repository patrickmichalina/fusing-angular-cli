import { FuseBox, QuantumPlugin, JSONPlugin, RawPlugin } from 'fuse-box'
import { src, task } from 'fuse-box/sparky'
import { resolve } from 'path'
import { argv } from 'yargs'
import { execSync } from 'child_process'
import shabang from './tools/scripts/fuse-shebang'
// import { unlinkSync } from 'fs'

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

task('test', () => {
  bundle.test('[spec/**/**.ts]', {})
})

task('cp.jest', () => {
  return src('jest/**', { base: 'src/templates/unit-tests' }).dest('.build/')
})

task('bundle', ['cp.jest', 'ng.modules'], () => {
  bundle.instructions('> [src/index.ts]')
  !isProdBuild &&
    bundle.watch(`src/**`).completed(fp => shabang(fp.bundle, absOutputPath))

  fuseConfig.run().then(bp => {
    const bundle = bp.bundles.get(appName)
    bundle && shabang(bundle, absOutputPath)
  })
})

task('ng.modules', () => {
  return new Promise((res, rej) => {
    const tsc = execSync(
      resolve('node_modules/.bin/ngc --p src/modules/tsconfig.aot.json')
    ).toString()
    return tsc ? rej() : res()
  })
})
