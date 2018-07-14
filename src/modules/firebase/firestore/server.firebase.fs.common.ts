import { makeStateKey } from '@angular/platform-browser'

export function makeFirestoreStateTransferKey(fullUrl: string) {
  return makeStateKey<string>(`FS.${fullUrl}`)
}

export function constructFsUrl(host: string, path?: string, runQuery = false) {
  return `https://firestore.googleapis.com/v1beta1/projects/${host}/databases/(default)/documents${
    runQuery ? ':runQuery' : '/' + path
  }`
}
