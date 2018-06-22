export const FUSEBOX_DEFAULTS = {
  verbose: false,
  browser: {
    outputDir: '.dist/public/js',
    browserModule: 'src/browser/app.browser.jit.entry.ts',
    aotBrowserModule: '.aot/src/browser/app.browser.aot.entry.js',
    prod: {
      uglify: true,
      treeshake: true
    }
  },
  server: {
    outputDir: '.dist',
    serverModule: 'server/server.ts'
  }
}
