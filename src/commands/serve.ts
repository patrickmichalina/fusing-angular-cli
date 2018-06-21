import { command } from 'yargs'
import { take, tap } from 'rxjs/operators'
import { logInfo } from '../utilities/log'
import { FuseBox, JSONPlugin, QuantumPlugin } from 'fuse-box'
import { resolve } from 'path'
import { NgProdPlugin } from '../fusebox/ng.prod.plugin'
import { NgPolyfillPlugin } from '../fusebox/ng.polyfill.plugin'
import readConfig_ from '../utilities/read-config'

// function test() {
//   // const fuseBrowser = FuseBox.init({
//   //   homeDir: "src/browser",
//   //   output: ".dist/public/js/$name.js",
//   //   target: 'browser@es5',
//   //   plugins: [
//   //     // NgProdPlugin({ enabled: opts.productionBuild }),
//   //     // NgPolyfillPlugin(),
//   //     // NgCompilerPlugin({ enabled: opts.enableAotCompilaton }),
//   //     // NgOptimizerPlugin({ enabled: opts.enableAngularBuildOptimizer }),
//   //     // opts.productionBuild && QuantumPlugin({
//   //     //   warnings: false,
//   //     //   uglify: false,
//   //     //   treeshake: false,
//   //     //   bakeApiIntoBundle: 'vendor'
//   //     //   // replaceProcessEnv: false,
//   //     //   // processPolyfill: true,
//   //     //   // ensureES5: true
//   //     // })
//   //   ] as any
//   // })

//   const fuseServer = FuseBox.init({
//     target: 'server@es5',
//     homeDir,
//     output: `${outputDir}/$name.js`,
//     plugins: [
//       // NgProdPlugin({ enabled: opts.productionBuild, fileTest: 'server.angular.module' }),
//       // NgPolyfillPlugin({ isServer: true, fileTest: 'server.angular.module' })
//     ]
//   })

//   // const mainAppEntry = opts.enableAotCompilaton
//   //   ? 'main.aot.ts'
//   //   : 'main.ts'

//   // fuseBrowser
//   //   .bundle('vendor')
//   //   .instructions(` ~ ${mainAppEntry}`)

//   // fuseBrowser
//   //   .bundle('app')
//   //   .watch('src/**')
//   //   .instructions(` !> [${mainAppEntry}]`)

//   fuseServer
//     .bundle("server")
//     .watch("src/**")
//     .instructions(" > [server/server.ts]")
//     .completed(proc => proc.start())
// }

command(
  'serve [port][prod]',
  'serve your application',
  args => {
    return args
  },
  args => {
    serve(args.prod)
  }
)
  .option('prod', {
    default: false,
    description: 'Run with optimizations enabled'
  })
  .option('port', {
    default: 5000,
    description: 'Http server port number'
  })

function logServeCommandStart() {
  logInfo('Launching Serve Command')
}

function serve(isProdBuild = false) {
  readConfig_()
    .pipe(
      tap(logServeCommandStart),
      take(1)
    )
    .subscribe(config => {
      const cache = !isProdBuild
      const log = config.fusebox.verbose || false
      const homeDir = resolve(config.fusebox.server.homeDir)
      const serverOutput = resolve(config.fusebox.server.outputDir)
      const browserOutput = resolve(config.fusebox.browser.outputDir)
      const modulesFolder = resolve(process.cwd(), 'node_modules')

      const fuseBrowser = FuseBox.init({
        log,
        modulesFolder,
        homeDir,
        cache,
        output: `${browserOutput}/$name.js`,
        target: 'browser@es5',
        plugins: [
          NgProdPlugin({ enabled: isProdBuild }),
          NgPolyfillPlugin(),
          // NgCompilerPlugin({ enabled: opts.enableAotCompilaton }),
          // NgOptimizerPlugin({ enabled: opts.enableAngularBuildOptimizer }),
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
          NgProdPlugin({
            enabled: isProdBuild,
            fileTest: 'server.angular.module'
          }),
          NgPolyfillPlugin({
            isServer: true,
            fileTest: 'server.angular.module'
          })
        ]
      })

      fuseBrowser
        .bundle('vendor')
        .watch(`**`)
        .instructions(` ~ ${config.fusebox.browser.browserModule}`)

      fuseBrowser
        .bundle('app')
        .watch(`**`)
        .instructions(` !> [${config.fusebox.browser.browserModule}]`)

      fuseServer
        .bundle('server')
        .watch(`**`)
        .instructions(` > [${config.fusebox.server.serverModule}]`)
        .completed(proc => proc.start())

      fuseServer.run()
      fuseBrowser.run()
    })
}
