import { command } from 'yargs'
import { take, tap } from 'rxjs/operators'
import { logInfo } from '../utilities/log'
import {
  FuseBox,
  JSONPlugin,
  QuantumPlugin,
  RawPlugin,
  SassPlugin
} from 'fuse-box'
import { resolve } from 'path'
import { NgProdPlugin } from '../fusebox/ng.prod.plugin'
import { NgPolyfillPlugin } from '../fusebox/ng.polyfill.plugin'
import { NgCompilerPlugin } from '../fusebox/ng.compiler.plugin'
import readConfig_ from '../utilities/read-config'
import { Ng2TemplatePlugin } from 'ng2-fused'

command(
  'serve [port][prod][aot][sw]',
  'serve your application',
  args => {
    return args
  },
  args => {
    serve(args.prod, args.aot)
  }
)
  .option('prod', {
    default: false,
    description: 'Run with optimizations enabled'
  })
  .option('aot', {
    default: false,
    description: 'Pass through AOT Compiler'
  })
  .option('sw', {
    default: false,
    description: 'Enable service-worker'
  })
  .option('port', {
    default: 5000,
    description: 'Http server port number'
  })

function logServeCommandStart() {
  logInfo('Launching Serve Command')
}

function serve(isProdBuild = false, isAotBuild = false) {
  readConfig_()
    .pipe(
      tap(logServeCommandStart),
      take(1)
    )
    .subscribe(config => {
      const cache = !isProdBuild
      const log = config.fusebox.verbose || false
      const homeDir = resolve('.')
      const serverOutput = resolve(config.fusebox.server.outputDir)
      const browserOutput = resolve(config.fusebox.browser.outputDir)
      const modulesFolder = resolve(process.cwd(), 'node_modules')
      const watchDir = `${homeDir}/src/**`
      const browserModule = isAotBuild
        ? config.fusebox.browser.aotBrowserModule
        : config.fusebox.browser.browserModule

      const fuseBrowser = FuseBox.init({
        log,
        modulesFolder,
        homeDir,
        cache,
        output: `${browserOutput}/$name.js`,
        target: 'browser@es5',
        useTypescriptCompiler: true,
        plugins: [
          Ng2TemplatePlugin(),
          ['*.component.html', RawPlugin()],
          NgProdPlugin({ enabled: isProdBuild }),
          NgCompilerPlugin({ enabled: isAotBuild }),
          NgPolyfillPlugin(),
          // NgOptimizerPlugin({ enabled: opts.enableAngularBuildOptimizer }),
          [
            '*.component.css',
            SassPlugin({
              indentedSyntax: false,
              importer: true,
              sourceMap: false,
              outputStyle: 'compressed'
            } as any),
            RawPlugin()
          ],
          isProdBuild &&
            QuantumPlugin({
              warnings: false,
              uglify: config.fusebox.browser.prod.uglify,
              treeshake: config.fusebox.browser.prod.treeshake,
              bakeApiIntoBundle: 'vendor'
              // replaceProcessEnv: false,
              // processPolyfill: true,
              // ensureES5: true
            })
        ] as any
      })

      const fuseServer = FuseBox.init({
        log,
        modulesFolder,
        target: 'server@es5',
        cache,
        homeDir,
        output: `${serverOutput}/$name.js`,
        plugins: [
          JSONPlugin(),
          Ng2TemplatePlugin(),
          ['*.component.html', RawPlugin()],
          [
            '*.component.css',
            SassPlugin({
              indentedSyntax: false,
              importer: true,
              sourceMap: false,
              outputStyle: 'compressed'
            } as any),
            RawPlugin()
          ],
          NgProdPlugin({
            enabled: true,
            fileTest: 'server.angular.module.ts'
          }),
          NgPolyfillPlugin({
            isServer: true,
            fileTest: 'server.angular.module.ts'
          })
        ]
      })

      fuseBrowser
        .bundle('vendor')
        .watch(watchDir)
        .instructions(` ~ ${browserModule}`)

      fuseBrowser
        .bundle('app')
        .watch(watchDir)
        .instructions(` !> [${browserModule}]`)

      fuseServer
        .bundle('server')
        .watch(watchDir)
        .instructions(` > [${config.fusebox.server.serverModule}]`)
        .completed(proc => proc.start())

      fuseServer.run()
      fuseBrowser.run()
    })
}
