import { singular } from 'pluralize'

export function parse(input: string): ParseResult {
  let parser = new Parser()
  parser.parse(input)
  return parser
}

export type ParseResult = {
  controller_list: Controller[]
}

export type Controller = {
  scope: string
  api_list: API[]
}

export type API = {
  method: string
  path: string
  params: string[]
}

class Parser implements ParseResult {
  controller_list: Controller[] = []
  controller_map = new Map<string, Controller>()
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
    this.controller_list = []
    for (;;) {
      let api = this.parseAPI()
      if (!api) break
      let scope = this.parseScope(api.path)
      let controller = this.getOrCreateController(scope)
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
  parseScope(path: string): string {
    let scope = path.match(/^\/(\w+)/)?.[1]
    if (!scope)
      throw new Error(
        'Invalid api path, expect to have controller prefix, e.g. /users , got: ' +
          path,
      )
    return singular(scope)
  }
  getOrCreateController(scope: string): Controller {
    let controller = this.controller_map.get(scope)
    if (controller) return controller
    controller = { scope, api_list: [] }
    this.controller_list.push(controller)
    this.controller_map.set(scope, controller)
    return controller
  }
}
