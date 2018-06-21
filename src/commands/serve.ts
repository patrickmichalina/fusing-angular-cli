import { command } from 'yargs'
import { take, tap } from 'rxjs/operators'
import { logInfo } from '../utilities/log'
import { FuseBox, JSONPlugin } from 'fuse-box'
import readConfig_ from '../utilities/read-config'
import { resolve } from 'path'
import { NgProdPlugin } from '../fusebox/ng.prod.plugin'
import { NgPolyfillPlugin } from '../fusebox/ng.polyfill.plugin'

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
  'serve [port]',
  'serve your application',
  args => {
    return args
  },
  args => {
    serve()
  }
).option('port', {
  alias: 'p',
  default: 5000,
  description: 'Http server port number'
})

function logServeCommandStart() {
  logInfo('Launching Serve Command')
}

function serve() {
  readConfig_()
    .pipe(
      tap(logServeCommandStart),
      take(1)
    )
    .subscribe(config => {
      const homeDir = resolve(config.fusebox.server.homeDir)
      const serverOutput = resolve(config.fusebox.server.outputDir)
      const browserOutput = resolve(config.fusebox.browser.outputDir)

      const fuseBrowser = FuseBox.init({
        homeDir,
        cache: false,
        output: `${browserOutput}/$name.js`,
        target: 'browser@es5',
        plugins: [
          NgProdPlugin({ enabled: false }),
          NgPolyfillPlugin()
          // NgCompilerPlugin({ enabled: opts.enableAotCompilaton }),
          // NgOptimizerPlugin({ enabled: opts.enableAngularBuildOptimizer }),
          // opts.productionBuild && QuantumPlugin({
          //   warnings: false,
          //   uglify: false,
          //   treeshake: false,
          //   bakeApiIntoBundle: 'vendor'
          //   // replaceProcessEnv: false,
          //   // processPolyfill: true,
          //   // ensureES5: true
          // })
        ] as any
      })

      const fuseServer = FuseBox.init({
        target: 'server@es5',
        cache: false,
        homeDir,
        output: `${serverOutput}/$name.js`,
        plugins: [
          JSONPlugin(),
          NgProdPlugin({ enabled: false, fileTest: 'server.angular.module' }),
          NgPolyfillPlugin({
            isServer: true,
            fileTest: 'server.angular.module'
          })
        ]
      })

      fuseBrowser
        .bundle('vendor')
        .watch('src/**')
        .instructions(` ~ src/browser/app.browser.module.ts`)

      fuseBrowser
        .bundle('app')
        .watch('src/**')
        .instructions(` !> [src/browser/app.browser.module.ts]`)

      fuseServer
        .bundle('server')
        .watch(`src/**`)
        .instructions(' > [src/server/server.ts]')
        .completed(proc => proc.start())

      fuseServer.run()
      fuseBrowser.run()
    })
}
