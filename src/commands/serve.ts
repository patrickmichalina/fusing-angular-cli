import { command } from 'yargs'
import { take, tap } from 'rxjs/operators'
import { logInfo } from '../utilities/log'
import {
  FuseBox,
  JSONPlugin,
  QuantumPlugin,
  RawPlugin,
  SassPlugin,
  EnvPlugin,
  WebIndexPlugin,
  UglifyJSPlugin
} from 'fuse-box'
import { resolve } from 'path'
import { NgProdPlugin } from '../fusebox/ng.prod.plugin'
import { NgPolyfillPlugin } from '../fusebox/ng.polyfill.plugin'
import { Ng2TemplatePlugin } from 'ng2-fused'
import { FuseProcess } from 'fuse-box/FuseProcess'
import { NgAotFactoryPlugin } from '../fusebox/ng.aot-factory.plugin'
import { main as ngc } from '@angular/compiler-cli/src/main'
import { CompressionPlugin } from '../fusebox/compression.plugin'
import { appEnvironmentVariables } from '../utilities/environment-variables'
import { renderSassDir } from '../utilities/sass'
import { exec, execSync } from 'child_process'
import { NgSwPlugin } from '../fusebox/ng.sw.plugin'
import { copy } from 'fs-extra'
import { NgAotRelativePlugin } from '../fusebox/ng.aot-relative.plugin'
import clearTerminal from '../utilities/clear'
import readConfig_ from '../utilities/read-config'

command(
  'serve [port][prod][sw]',
  'serve your application',
  args => {
    return args
  },
  args => {
    serve(args.prod, args.sw)
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

export function serve(
  isProdBuild = false,
  isServiceWorkerEnabled = false,
  buildOnly = false
) {
  readConfig_()
    .pipe(
      tap(logServeCommandStart),
      take(1)
    )
    .subscribe(config => {
      const cache = !isProdBuild
      const isAotBuild = isProdBuild
      const isLocalDev = !isProdBuild
      const log = config.fusebox.verbose || false
      const homeDir = resolve('.')
      const serverOutput = resolve(config.fusebox.server.outputDir)
      const browserOutput = resolve(config.fusebox.browser.outputDir)
      const modulesFolder = resolve(process.cwd(), 'node_modules')
      const watchDir = resolve(`${homeDir}/src/**`)
      const appName =
        (config.favicon &&
          config.favicon.config &&
          config.favicon.config.appName) ||
        'FUSING ANGULAR'
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
          isAotBuild &&
            NgAotRelativePlugin({
              '"./not-found.component"': 'not-found/not-found.component',
              '"../response/browser.response.service"':
                'response/browser.response.service'
            }),
          isServiceWorkerEnabled && NgSwPlugin(),
          Ng2TemplatePlugin(),
          ['*.component.html', RawPlugin()],
          WebIndexPlugin({
            bundles: ['app', 'vendor'],
            path: 'js',
            target: '../index.html',
            template: resolve('src/app/index.pug'),
            engine: 'pug',
            locals: {
              pageTitle: appName,
              isLocalDev,
              faviconMeta: (config.generatedMetaTags || []).join('\n')
            }
          }),
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
            }),
          CompressionPlugin()
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
            FUSING_ANGULAR: JSON.stringify(appEnvironmentVariables)
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

      const fuseSw = FuseBox.init({
        homeDir: resolve('node_modules/@angular/service-worker'),
        output: `${browserOutput}/$name.js`,
        target: 'browser@es5',
        plugins: [isProdBuild && UglifyJSPlugin(), CompressionPlugin()] as any
      })
      fuseSw.bundle('ngsw-worker').instructions(' > [ngsw-worker.js]')

      // tslint:disable:no-if-statement
      const vendor = fuseBrowser.bundle('vendor')
      if (!buildOnly) vendor.watch(watchDir)
      vendor.instructions(` ~ ${browserModule}`).completed(fn => {
        isServiceWorkerEnabled &&
          execSync(
            `node_modules/.bin/ngsw-config .dist/public src/app/ngsw.json`
          )
        const serverBundle = fuseServer
          .bundle('server')
          .instructions(` > [${config.fusebox.server.serverModule}]`)

        if (!buildOnly) {
          serverBundle.completed(proc => {
            prevServerProcess && prevServerProcess.kill()
            clearTerminal()
            proc.start()
            prevServerProcess = proc
          })
        }
        fuseServer.run()
      })

      const appBundle = fuseBrowser.bundle('app')
      if (!buildOnly) appBundle.watch(watchDir)
      appBundle
        .instructions(` !> [${browserModule}]`)
        .splitConfig({ dest: '../js/modules' })

      logInfo('Bundling your application, this may take some time...')

      renderSassDir()

      if (!buildOnly) {
        const sass = exec(
          'node_modules/.bin/node-sass --watch src/**/*.scss --output-style compressed --output src/**'
        )
        sass.on('error', err => {
          console.log(err)
          process.exit(1)
        })
        sass.on('message', err => {
          console.error(err)
          process.exit(1)
        })
        sass.stderr.on('data', err => {
          console.log(err)
          process.exit(1)
        })
      }

      copy(resolve('src/assets'), resolve('.dist/public/assets'))
        .then(() => fuseSw.run())
        .then(() => {
          fuseBrowser.run({ chokidar: { ignored: /^(.*\.scss$)*$/gim } })
        })
        .catch(() => {
          fuseSw.run().then(() => {
            fuseBrowser.run({ chokidar: { ignored: /^(.*\.scss$)*$/gim } })
          })
        })
    })
}
