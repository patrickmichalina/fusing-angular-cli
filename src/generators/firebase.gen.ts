import { resolve } from 'path'
import { writeFile_, writeFileSafely_ } from '../utilities/rx-fs'
import { firebaseModule } from '../templates/core/app'

const configPath = 'src/app/firebase.module.ts'

export default function generateFirebase(dir: string, overwrite = false) {
  return overwrite
    ? writeFile_(resolve(dir, configPath), firebaseModule)
    : writeFileSafely_(resolve(dir, configPath), firebaseModule)
}
