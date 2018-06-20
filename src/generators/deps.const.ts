const ANGULAR_VERSION = '^6.1.0-beta.1'

export const ANGULAR_CORE_DEV_DEPS = {
  '@types/node': '^10.3.3'
}

export const ANGULAR_CORE_DEPS = {
  '@angular/common': ANGULAR_VERSION,
  '@angular/compiler': ANGULAR_VERSION,
  '@angular/compiler-cli': ANGULAR_VERSION,
  '@angular/core': ANGULAR_VERSION,
  '@angular/http': ANGULAR_VERSION,
  '@angular/platform-browser': ANGULAR_VERSION,
  '@angular/platform-browser-dynamic': ANGULAR_VERSION,
  '@angular/router': ANGULAR_VERSION,
  'core-js': '^2.5.7',
  rxjs: '^6.2.1',
  typescript: '2.7.2',
  'zone.js': '^0.8.26'
}

export const ANGULAR_UNIVERSAL_DEPS = {
  '@angular/animations': ANGULAR_VERSION,
  '@angular/platform-server': ANGULAR_VERSION,
  '@nguniversal/common': '^6.0.0',
  '@nguniversal/express-engine': '^6.0.0'
}

export const ANGULAR_UNIVERSAL_DEV_DEPS = {
  '@types/cookie-parser': '^1.4.1',
  '@types/express': '^4.16.0'
}

export const ANGULAR_UNIVERSAL_EXPRESS_DEPS = {
  'cookie-parser': '^1.4.3',
  express: '^4.16.3',
  'express-minify-html': '^0.12.0'
}
