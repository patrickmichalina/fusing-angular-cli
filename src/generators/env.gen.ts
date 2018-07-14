import { writeFileSafely_, writeFile_ } from '../utilities/rx-fs'
import { resolve } from 'path'
import { FirebaseConfig } from '../commands/create-common'
import * as env from '../templates/env.txt'

const configPath = '.env'

export function firebaseEnvConfigMap(config: FirebaseConfig) {
  return `FNG_FIREBASE_API_KEY=${config.apiKey}
FNG_FIREBASE_AUTH_DOMAIN=${config.authDomain}
FNG_FIREBASE_DATABASE_URL=${config.databaseUrl}
FNG_FIREBASE_PROJECT_ID=${config.projectId}
FNG_FIREBASE_STORAGE_BUCKET=${config.storageBucket}
FNG_FIREBASE_MESSAGING_SENDER_ID=${config.messagingSenderId}`
}

export default function generateDotEnv(
  dir: string,
  overwrite = false,
  firebaseConfig?: FirebaseConfig
) {
  const final = firebaseConfig
    ? env.replace('$FIREBASE', firebaseEnvConfigMap(firebaseConfig))
    : env

  return overwrite
    ? writeFile_(resolve(dir, configPath), final)
    : writeFileSafely_(resolve(dir, configPath), final)
}
