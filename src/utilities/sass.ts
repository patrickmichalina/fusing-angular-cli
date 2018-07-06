import { readdirSync, statSync, writeFileSync } from 'fs'
import { join, resolve } from 'path'
import { renderSync } from 'node-sass'

const read = (dir: string): ReadonlyArray<string> =>
  readdirSync(dir)
    .reduce(
      (files: ReadonlyArray<string>, file) =>
        statSync(join(dir, file)).isDirectory()
          ? files.concat(read(join(dir, file)))
          : files.concat(join(dir, file)),
      []
    )
    .filter(a => a.includes('.scss'))

export function renderSassDir() {
  const sassFiles = read(resolve('.', 'src'))
  const results = sassFiles.map(mapToWriteableMetaData)

  results.forEach(res => {
    writeFileSync(res.resultPath, res.css, {})
  })
}

function mapToWriteableMetaData(filePath: string) {
  const rendered = renderSync({
    file: filePath,
    includePaths: [resolve('node_modules'), resolve('src')],
    outputStyle: 'compressed'
  })
  return {
    resultPath: filePath.replace('.scss', '.css'),
    css: rendered.css.toString()
  }
}

export function renderSingleSass(filePath: string) {
  const single = mapToWriteableMetaData(filePath)
  writeFileSync(single.resultPath, single.css, {})
}
