import { config as readDotEnv } from 'dotenv'

export interface AppEnvironmentSettings {
  readonly PORT: number
}

interface StringDictionary {
  readonly [key: string]: string
}

const newEnv = readDotEnv()

function keysWihoutCorrectPrefix(prefix = 'FNG_') {
  return function(key: string) {
    return key.includes(prefix)
  }
}

function toFngDictionaryObject(original: StringDictionary, prefix = 'FNG_') {
  return function(acc: Object, curr: string) {
    return {
      ...acc,
      [curr.replace(prefix, '')]: original[curr]
    }
  }
}

function cleanVars(dict = {}) {
  return Object.keys(dict)
    .filter(keysWihoutCorrectPrefix())
    .reduce(toFngDictionaryObject(dict), {})
}

export const appEnvironmentVariables = {
  ...cleanVars(process.env),
  ...cleanVars(newEnv.parsed)
} as AppEnvironmentSettings
