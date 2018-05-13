import { Bundle } from 'fuse-box'
import { writeFileSync, chmodSync } from 'fs'

const sheBang = '#!/usr/bin/env node'

export default function (bundle: Bundle, absOutputPath: string) {
  const final = `${sheBang}\n${bundle.generatedCode.toString()}`
  writeFileSync(absOutputPath, final)
  chmodSync(absOutputPath, '755')
}
