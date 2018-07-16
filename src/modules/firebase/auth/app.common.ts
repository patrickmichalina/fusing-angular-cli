export { FirebaseAuthAppModule } from './app.auth.module'

export interface ICookieGetSet {
  readonly set: (name: string, value: string) => string
  readonly remove: (name: string) => void
}
