export function parse(input: string): ParseResult {
  let parser = new Parser()
  parser.parse(input)
  return parser
}

export type ParseResult = {
  api_list: API[]
}

export type API = {
  method: string
  path: string
  params: string[]
}

class Parser implements ParseResult {
  api_list: API[] = []
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
    this.api_list = []
    for (;;) {
      let api = this.parseAPI()
      if (api) this.api_list.push(api)
      else break
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
    return { method, path, params: Array.from(params, match => match![1]) }
  }
}
