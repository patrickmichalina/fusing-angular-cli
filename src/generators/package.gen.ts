import { writeJsonFile_ } from '../utilities/rx-fs'
import { resolve } from 'path'

interface StringDictionary {
  readonly [key: string]: string
}

interface npmPackageConfig {
  readonly name: string
  readonly description?: string
  readonly license?: string
  readonly nodeVersionRange?: string
  readonly npmVersionRange?: string
  readonly version?: string
  readonly dependencies?: StringDictionary
  readonly devDependencies?: StringDictionary
}

const ANGULAR_VERSION = "6.0.1"

const coreAngularDeps = {
  "@angular/common": ANGULAR_VERSION,
  "@angular/compiler": ANGULAR_VERSION,
  "@angular/compiler-cli": ANGULAR_VERSION,
  "@angular/core": ANGULAR_VERSION,
  "@angular/http": ANGULAR_VERSION,
  "@angular/platform-browser": ANGULAR_VERSION,
  "@angular/platform-browser-dynamic": ANGULAR_VERSION,
  "@angular/router": ANGULAR_VERSION,
  "core-js": "2.5.6",
  "rxjs": "6.1.0",
  "typescript": "2.7.2",
  "zone.js": "0.8.26"
}

export default function generatePackageFile(config: npmPackageConfig, dirPath = '', filename = 'package.json') {
  const _config: npmPackageConfig = {
    version: '0.0.0',
    license: 'UNLICENSED',
    description: 'Angular app scaffolded by Fusing-Angular-CLI',
    dependencies: {
      ...coreAngularDeps
    },
    devDependencies: {},
    ...config
  }
  return writeJsonFile_(resolve(dirPath, filename), _config)
}