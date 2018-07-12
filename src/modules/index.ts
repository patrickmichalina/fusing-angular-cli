export { WINDOW } from './util/tokens'

export { IWindowService, WindowService } from './util/window/window.service'
export { WindowServerModule } from './util/window/window-server.module'
export { WindowBrowserModule } from './util/window/window-browser.module'

export { FirebaseBrowserModule } from './firebase/browser.firebase.module'
export {
  FirebaseServerModule,
  FIREBASE_USER_AUTH_TOKEN,
  FIREBASE_DATABASE_URL
} from './firebase/server.firebase.module'
export {
  ServerUniversalRtDbService
} from './firebase/server.firebase.rtdb.service'
export { UniversalRtDbService } from './firebase/browser.firebase.rtdb.service'
