import { snake_to_Pascal, snake_to_camel } from 'quick-erd/dist/utils/case'

export function kebab_to_snake(name: string): string {
  return name.replace(/-/g, '_')
}

export function kebab_to_Pascal(name: string): string {
  return snake_to_Pascal(kebab_to_snake(name))
}

export function kebab_to_camel(name: string): string {
  return snake_to_camel(kebab_to_snake(name))
}

export function u_first(name: string): string {
  return name.slice(0, 1).toUpperCase() + name.slice(1)
}

export function camel_to_snake(name: string) {
  let result = ''
  let isLastUpperCase = false
  for (let i = 0; i < name.length; i++) {
    let c = name[i]
    let isUpperCase = 'A' <= c && c <= 'Z'
    if (isUpperCase) {
      if (!isLastUpperCase) {
        result += '_'
      }
      result += c.toLowerCase()
    } else {
      result += c
    }
    isLastUpperCase = isUpperCase
  }
  return result
}
