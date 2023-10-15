import { API, Scope } from './ast'
import { plural } from 'pluralize'

export function apiToName(scope: Scope, api: API): string {
  let method = api.method.toLowerCase()

  let name = `${method}-${scope.name}`

  let parts = api.path.split('/').slice(2)

  if (parts.length == 0 && method == 'get') {
    name = `${method}-${plural(scope.name)}`
  }

  for (let part of parts) {
    if (part[0] != ':') {
      name += `-${part}`
    }
  }

  if (api.params.length > 0) {
    name += '-by-' + api.params.join('-and-')
  }

  return name
}
