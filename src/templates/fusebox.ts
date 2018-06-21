export const FUSEBOX_DEFAULTS = {
  verbose: false,
  browser: {
    homeDir: 'src',
    outputDir: '.dist/public/js',
    browserModule: 'browser/app.browser.module.ts',
    prod: {
      uglify: true,
      treeshake: true
    }
  },
  server: {
    homeDir: 'src',
    outputDir: '.dist',
    serverModule: 'server/server.ts'
  }
}
