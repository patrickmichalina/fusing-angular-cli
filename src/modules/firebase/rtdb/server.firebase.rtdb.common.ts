import { makeStateKey } from '@angular/platform-browser'

export function makeRtDbStateTransferKey(fullUrl: string) {
  return makeStateKey<string>(`RTDB.${fullUrl}`)
}
