import { readFileSync } from 'fs'
import { writeSrcFileIfNeeded } from 'quick-erd/dist/utils/file'

type Options = {
  file: string
  ClassName: string
}

export class ClassCode {
  lines: string[]
  constructor(private options: Options) {
    let code = this.readCode().trim()
    this.lines = code.split('\n')
    this.setClassName()
  }
  private readCode(): string {
    try {
      return readFileSync(this.options.file).toString()
    } catch (error) {
      return ''
    }
  }
  private trimCode() {
    this.lines = this.lines.join('\n').trim().split('\n')
  }
  hasLine(pattern: string | RegExp): boolean {
    return this.lines.some(line => line.match(pattern))
  }
  hasTrimmedLine(pattern: string): boolean {
    return this.lines.some(line => line.trim() == pattern)
  }
  setPackage(packageName: string) {
    if (this.hasLine(/^package /)) return
    this.trimCode()
    this.lines.unshift(`package ${packageName};`, '')
  }
  addImportLines(lines: string) {
    let importLines = lines
      .trim()
      .split('\n')
      .filter(line => !line || !this.lines.includes(line))
    this.trimCode()
    let index = this.lines.findIndex(line => line.startsWith('import '))
    if (index == -1) {
      this.lines.splice(1, 0, '', ...importLines)
    } else {
      this.lines.splice(index, 0, ...importLines)
    }
  }
  private setClassName() {
    let { ClassName } = this.options
    if (this.hasLine(`public class ${ClassName} {`)) return
    this.trimCode()
    this.lines.push('', `public class ${ClassName} {`, `}`)
  }
  private findClassIndex() {
    let { ClassName } = this.options
    let index = this.lines.indexOf(`public class ${ClassName} {`)
    if (index == -1)
      throw new Error(`Failed to locate first line of class "${ClassName}"`)
    return index
  }
  private insertLines(index: number, lines: string) {
    this.lines.splice(index, 0, ...lines.split('\n'))
  }
  addBeforeClass(lines: string) {
    let index = this.findClassIndex()
    this.insertLines(index, lines)
  }
  prependInClass(lines: string) {
    let index = this.findClassIndex() + 1
    this.insertLines(index, lines)
  }
  appendInClass(lines: string) {
    let { ClassName } = this.options
    let index = this.lines.lastIndexOf('}')
    if (index == -1)
      throw new Error(`Failed to locate last line of class "${ClassName}"`)
    this.insertLines(index, lines)
  }
  save() {
    let { file } = this.options
    let code = this.lines.join('\n')
    writeSrcFileIfNeeded(file, code)
  }
}

function trimLines(lines: string): string[] {
  return lines.trim().split('\n')
}
