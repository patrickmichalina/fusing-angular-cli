import { command } from 'yargs'
import { take, tap } from 'rxjs/operators'
import { logInfo } from '../utilities/log'
import {
  FuseBox,
  JSONPlugin,
  QuantumPlugin,
  RawPlugin,
  SassPlugin,
  EnvPlugin
} from 'fuse-box'
import { resolve } from 'path'
import { NgProdPlugin } from '../fusebox/ng.prod.plugin'
import { NgPolyfillPlugin } from '../fusebox/ng.polyfill.plugin'
import readConfig_ from '../utilities/read-config'
import { Ng2TemplatePlugin } from 'ng2-fused'
import { FuseProcess } from 'fuse-box/FuseProcess'
import { NgAotFactoryPlugin } from '../fusebox/ng.aot-factory.plugin'
import clearTerminal from '../utilities/clear'
import { main as ngc } from '@angular/compiler-cli/src/main'

command(
  'serve [port][prod][aot][sw]',
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

function serve(isProdBuild = false) {
  readConfig_()
    .pipe(
      tap(logServeCommandStart),
      take(1)
    )
    .subscribe(config => {
      const cache = !isProdBuild
      const isAotBuild = isProdBuild
      const log = config.fusebox.verbose || false
      const homeDir = resolve('.')
      const serverOutput = resolve(config.fusebox.server.outputDir)
      const browserOutput = resolve(config.fusebox.browser.outputDir)
      const modulesFolder = resolve(process.cwd(), 'node_modules')
      const watchDir = `${homeDir}/src/**`
      const browserModule = isAotBuild
        ? config.fusebox.browser.aotBrowserModule
        : config.fusebox.browser.browserModule

      isAotBuild && ngc(['-p', resolve('tsconfig.aot.json')])

      const fuseBrowser = FuseBox.init({
        log,
        modulesFolder,
        homeDir,
        cache,
        output: `${browserOutput}/$name.js`,
        target: 'browser@es5',
        useTypescriptCompiler: true,
        plugins: [
          isAotBuild && NgAotFactoryPlugin(),
          Ng2TemplatePlugin(),
          ['*.component.html', RawPlugin()],
          NgProdPlugin({ enabled: isProdBuild }),
          NgPolyfillPlugin(),
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
          EnvPlugin({
            FUSING_ANGULAR: JSON.stringify(config.environment)
          }),
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

      // tslint:disable-next-line:no-let
      let prevServerProcess: FuseProcess

      fuseBrowser
        .bundle('vendor')
        .watch(watchDir)
        .instructions(` ~ ${browserModule}`)
        .completed(fn => {
          fuseServer
            .bundle('server')
            .instructions(` > [${config.fusebox.server.serverModule}]`)
            .completed(proc => {
              prevServerProcess && prevServerProcess.kill()
              clearTerminal()
              proc.start()
              prevServerProcess = proc
            })
          fuseServer.run()
        })

      fuseBrowser
        .bundle('app')
        .watch(watchDir)
        .instructions(` !> [${browserModule}]`)
        .splitConfig({ dest: '../js/modules' })

      logInfo('Bundling your application, this may take some time...')
      fuseBrowser.run()
    })
}
