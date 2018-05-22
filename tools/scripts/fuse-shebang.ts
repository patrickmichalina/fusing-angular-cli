import { Bundle } from 'fuse-box'
import { writeFileSync, chmodSync } from 'fs'
import { logError } from '../../src/utilities/log'

const sheBang = '#!/usr/bin/env node'

export default function(bundle: Bundle, absOutputPath: string) {
  try {
    const final = `${sheBang}\n${bundle.generatedCode.toString()}`
    writeFileSync(absOutputPath, final)
    chmodSync(absOutputPath, '755')
  } catch (err) {
    logError(err)
  }
}
