export const FUSEBOX_DEFAULTS = {
  verbose: false,
  browser: {
    outputDir: '.dist/public/js',
    browserModule: 'src/browser/app.browser.entry.jit.ts',
    aotBrowserModule: '.aot/src/browser/app.browser.entry.aot.js',
    prod: {
      uglify: true,
      treeshake: true
    }
  },
  server: {
    outputDir: '.dist',
    serverModule: 'src/server/server.ts'
  }
}
