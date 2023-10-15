import { singular } from 'pluralize'

export function parse(input: string): ParseResult {
  let parser = new Parser()
  parser.parse(input)
  return parser
}

export type ParseResult = {
  scope_list: Scope[]
}

export type Scope = {
  prefix: string
  name: string
  api_list: API[]
}

export type API = {
  method: string
  path: string
  params: string[]
}

class Parser implements ParseResult {
  scope_list: Scope[] = []
  scope_map = new Map<string, Scope>()
  line_list: string[] = []
  parse(input: string) {
    input.split('\n').forEach(line => {
      line = line
        .trim()
        .replace(/#.*/, '')
        .replace(/\/\/.*/, '')
        .trim()
      if (!line) return
      this.line_list.push(line)
    })
    this.scope_list = []
    for (;;) {
      let api = this.parseAPI()
      if (!api) break
      let { prefix, name } = this.parseScope(api.path)
      let controller = this.getOrCreateController(prefix, name)
      controller.api_list.push(api)
    }
  }
  parseAPI(): API | null {
    let line = this.line_list.shift()
    if (!line) return null
    let match = line.match(/(\w+) (.*)/)
    if (!match)
      throw new Error('Invalid line, expect [method] [path], got: ' + line)
    let method = match[1].toUpperCase()
    let path = match[2]
    let params = path.matchAll(/:(\w+)/g)
    return {
      method,
      path,
      params: Array.from(params, match => match![1]),
    }
  }
  parseScope(path: string) {
    let prefix = path.match(/^\/(\w+)/)?.[1]
    if (!prefix)
      throw new Error(
        'Invalid api path, expect to have controller prefix, e.g. /users , got: ' +
          path,
      )
    let name = singular(prefix)
    return { prefix, name }
  }
  getOrCreateController(prefix: string, name: string): Scope {
    let scope = this.scope_map.get(name)
    if (scope) return scope
    scope = { prefix, name, api_list: [] }
    this.scope_list.push(scope)
    this.scope_map.set(name, scope)
    return scope
  }
}
