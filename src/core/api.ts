import { API, Scope } from './ast'

export function apiToName(scope: Scope, api: API): string {
  let method = api.method.toLowerCase()

  let name = `${method}-${scope.name}`
  if (api.params.length > 0) {
    name += '-by-' + api.params.join('-and-')
  }

  return name
}
