'use strict'

require('core-js/es6/reflect')
require('core-js/es7/reflect')
require('zone.js/dist/zone.js')
require('zone.js/dist/proxy.js')
require('zone.js/dist/sync-test')
require('zone.js/dist/async-test')
require('zone.js/dist/fake-async-test')

/**
 * Patch Jest's describe/test/beforeEach/afterEach functions so test code
 * always runs in a testZone (ProxyZone).
 */

if (Zone === undefined) {
  throw new Error('Missing: Zone (zone.js)')
}
if (jest === undefined) {
  throw new Error(
    'Missing: jest.\n' +
      'This patch must be included in a script called with ' +
      '`setupTestFrameworkScriptFile` in Jest config.'
  )
}
if (jest['__zone_patch__'] === true) {
  throw new Error("'jest' has already been patched with 'Zone'.")
}

jest['__zone_patch__'] = true
const SyncTestZoneSpec = Zone['SyncTestZoneSpec']
const ProxyZoneSpec = Zone['ProxyZoneSpec']

if (SyncTestZoneSpec === undefined) {
  throw new Error('Missing: SyncTestZoneSpec (zone.js/dist/sync-test)')
}
if (ProxyZoneSpec === undefined) {
  throw new Error('Missing: ProxyZoneSpec (zone.js/dist/proxy.js)')
}

const env = global
const ambientZone = Zone.current

// Create a synchronous-only zone in which to run `describe` blocks in order to
// raise an error if any asynchronous operations are attempted
// inside of a `describe` but outside of a `beforeEach` or `it`.
const syncZone = ambientZone.fork(new SyncTestZoneSpec('jest.describe'))
function wrapDescribeInZone(describeBody) {
  return () => syncZone.run(describeBody, null, arguments)
}

// Create a proxy zone in which to run `test` blocks so that the tests function
// can retroactively install different zones.
const testProxyZone = ambientZone.fork(new ProxyZoneSpec())
function wrapTestInZone(testBody) {
  if (testBody === undefined) {
    return
  }
  return testBody.length === 0
    ? () => testProxyZone.run(testBody, null)
    : done => testProxyZone.run(testBody, null, [done])
}

;['xdescribe', 'fdescribe', 'describe'].forEach(methodName => {
  const originaljestFn = env[methodName]
  env[methodName] = function(description, specDefinitions) {
    return originaljestFn.call(
      this,
      description,
      wrapDescribeInZone(specDefinitions)
    )
  }
  if (methodName === 'describe') {
    env[methodName].only = env['fdescribe']
    env[methodName].skip = env['xdescribe']
  }
})

;['xit', 'fit', 'test', 'it'].forEach(methodName => {
  const originaljestFn = env[methodName]
  env[methodName] = function(description, specDefinitions, timeout) {
    arguments[1] = wrapTestInZone(specDefinitions)
    return originaljestFn.apply(this, arguments)
  }
  if (methodName === 'test' || methodName === 'it') {
    env[methodName].only = env['fit']
    env[methodName].skip = env['xit']
  }
})

;['beforeEach', 'afterEach', 'beforeAll', 'afterAll'].forEach(methodName => {
  const originaljestFn = env[methodName]
  env[methodName] = function(specDefinitions, timeout) {
    arguments[0] = wrapTestInZone(specDefinitions)
    return originaljestFn.apply(this, arguments)
  }
})

// const AngularSnapshotSerializer = require('./AngularSnapshotSerializer');
// const HTMLCommentSerializer = require('./HTMLCommentSerializer');
const getTestBed = require('@angular/core/testing').getTestBed
const BrowserDynamicTestingModule = require('@angular/platform-browser-dynamic/testing')
  .BrowserDynamicTestingModule
const platformBrowserDynamicTesting = require('@angular/platform-browser-dynamic/testing')
  .platformBrowserDynamicTesting

getTestBed().initTestEnvironment(
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting()
)

const mock = () => {
  let storage = {}
  return {
    getItem: key => (key in storage ? storage[key] : null),
    setItem: (key, value) => (storage[key] = value || ''),
    removeItem: key => delete storage[key],
    clear: () => (storage = {})
  }
}
// Object.defineProperty(window, 'Hammer', { value: {} });
Object.defineProperty(window, 'CSS', { value: mock() })
Object.defineProperty(window, 'matchMedia', {
  value: jest.fn(() => ({ matches: true }))
})
Object.defineProperty(window, 'localStorage', { value: mock() })
Object.defineProperty(window, 'sessionStorage', { value: mock() })
Object.defineProperty(window, 'getComputedStyle', {
  value: () => {
    return {
      display: 'none',
      appearance: ['-webkit-appearance']
    }
  }
})

// For Angular Material
Object.defineProperty(document.body.style, 'transform', {
  value: () => {
    return {
      enumerable: true,
      configurable: true
    }
  }
})
