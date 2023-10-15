import { Scope } from './ast'
import { join } from 'path'
import { parse } from './ast'
import { kebab_to_Pascal, kebab_to_camel, u_first } from '../utils/case'
import { writeSrcFileIfNeeded } from 'quick-erd/dist/utils/file'
import {
  SpringBootApplication,
  setupDirectories,
} from 'quick-erd/dist/db/text-to-spring'

export function genAPI(text: string) {
  const result = parse(text)

  const package_name_list = ['controller', 'service', 'model', 'dto', 'mapper']
  const app = setupDirectories(package_name_list)

  for (const scope of result.scope_list) {
    setupController(app, scope)
  }
}

function setupController(app: SpringBootApplication, scope: Scope) {
  const dir = join(app.dir, 'controller')
  const ClassName = kebab_to_Pascal(scope.name)
  const className = kebab_to_camel(scope.name)
  const file = join(dir, `${ClassName}Controller.java`)

  let body = ''
  const imports = new Set<string>()

  for (const api of scope.api_list) {
    let method = api.method.toLowerCase()
    let Method = u_first(method)
    let name = method + 'TODO'
    let Name = Method + 'TODO'
    body += `
  @${Method}Mapping
  public ${Name}ResponseDTO ${name}(@RequestBody() ${Name}RequestDTO ${name}RequestDTO) {
    // TODO add validation logic
    return ${className}Service.${name}(${name}RequestDTO);
  }`
  }

  let importLines = Array.from(imports).join('\n')

  importLines = `
import ${app.package}.service.${ClassName}Service;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.repository.query.Param;
import org.springframework.web.bind.annotation.*;
${importLines}
`.trim()

  const code =
    `
package ${app.package}.controller;

${importLines}

@RestController
@RequestMapping("${scope.name}")
public class ${ClassName}Controller {
  @Autowired
  ${ClassName}Service ${className}Service;

  ${body.trim()}
`.trim() +
    `
}`
  writeSrcFileIfNeeded(file, code)
}
