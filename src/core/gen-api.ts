import { API, Scope } from './ast'
import { join } from 'path'
import { parse } from './ast'
import { kebab_to_Pascal, kebab_to_camel, u_first } from '../utils/case'
import { writeSrcFileIfNeeded } from 'quick-erd/dist/utils/file'
import {
  SpringBootApplication,
  setupDirectories,
} from 'quick-erd/dist/db/text-to-spring'
import { existsSync, mkdirSync } from 'fs'
import { apiToName } from './api'

export function genAPI(text: string) {
  const result = parse(text)

  const package_name_list = ['controller', 'service', 'model', 'mapper']
  const app = setupDirectories(package_name_list)

  for (const scope of result.scope_list) {
    setupController(app, scope)
    setupService(app, scope)
  }
  setupMapper(app)
}

function setupController(app: SpringBootApplication, scope: Scope) {
  const dir = join(app.dir, 'controller', scope.name)
  mkdirSync(dir, { recursive: true })
  const ClassName = kebab_to_Pascal(scope.name)
  const className = kebab_to_camel(scope.name)
  const file = join(dir, `${ClassName}Controller.java`)

  let body = ''
  const imports = new Set<string>()

  for (const api of scope.api_list) {
    let { Name, name } = setupControllerDTO(app, scope, api)

    let Method = u_first(api.method.toLowerCase())
    let annotation = `@${Method}Mapping`
    let path = api.path.replace('/' + scope.prefix, '').replace(/^\//, '')
    if (path) {
      annotation += `("${path}")`
    }

    body += `
  ${annotation}
  public ${Name}ResponseDTO ${name}(@RequestBody() ${Name}RequestDTO ${name}RequestDTO) {
    // TODO add validation logic
    return ${className}Service.${name}(${name}RequestDTO);
  }`
  }

  let importLines = Array.from(imports).join('\n')

  importLines = `
import ${app.package}.controller.${scope.name}.dto.*;
import ${app.package}.service.${ClassName}Service;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.repository.query.Param;
import org.springframework.web.bind.annotation.*;
${importLines}
`.trim()

  const code =
    `
package ${app.package}.controller.${scope.name};

${importLines}

@RestController
@RequestMapping("${scope.prefix}")
public class ${ClassName}Controller {
  @Autowired
  ${ClassName}Service ${className}Service;

  ${body.trim()}
`.trim() +
    `
}`
  writeSrcFileIfNeeded(file, code)
}

function setupService(app: SpringBootApplication, scope: Scope) {
  const dir = join(app.dir, 'service')
  const ClassName = kebab_to_Pascal(scope.name)
  const className = kebab_to_camel(scope.name)
  const file = join(dir, `${ClassName}Service.java`)

  const repositoryFile = join(
    app.dir,
    'repository',
    ClassName + 'Repository.java',
  )
  const hasRepository = existsSync(repositoryFile)

  let importLines = `
import org.springframework.stereotype.Service;
`

  let body = ''

  if (hasRepository) {
    importLines = `
import ${app.package}.repository.${ClassName}Repository;
import org.springframework.beans.factory.annotation.Autowired;
${importLines}
`.trim()
    body += `
  @Autowired
  ${ClassName}Repository ${className}Repository;
`
  }

  let code = `
package ${app.package}.service;

${importLines.trim()}

@Service
public class ${ClassName}Service {`

  body = body.trim()
  if (body) {
    code += `
  ${body}`
  }
  code += `
}`

  writeSrcFileIfNeeded(file, code)
}

function setupControllerDTO(
  app: SpringBootApplication,
  scope: Scope,
  api: API,
) {
  let _name_ = apiToName(scope, api)
  let Name = kebab_to_Pascal(_name_)
  let name = kebab_to_camel(_name_)

  const dir = join(app.dir, 'controller', scope.name, 'dto')
  mkdirSync(dir, { recursive: true })

  let packageName = `${app.package}.controller.${scope.name}.dto`

  setupDTOFile(dir, packageName, Name + 'RequestDTO')
  setupDTOFile(dir, packageName, Name + 'ResponseDTO')

  return { _name_, Name, name }
}

function setupDTOFile(dir: string, packageName: string, ClassName: string) {
  const file = join(dir, `${ClassName}.java`)

  let code = `
package ${packageName};

public class ${ClassName} {
}
`

  writeSrcFileIfNeeded(file, code)
}

function setupMapper(app: SpringBootApplication) {
  const dir = join(app.dir, 'mapper')
  const ClassName = 'MapperUtils'
  const file = join(dir, `${ClassName}.java`)

  let code = `
package ${app.package}.mapper;

import java.lang.reflect.Field;

public class MapperUtils {
  public static <From, To> void copy(From fromObject, To toObject) {
    Class<?> fromClass = fromObject.getClass();
    for (Field toField : toObject.getClass().getFields()) {
      try {
        String fieldName = toField.getName();
        Field fromField = fromClass.getDeclaredField(fieldName);
        fromField.setAccessible(true);
        Object fieldValue = fromField.get(fromObject);
        toField.set(toObject, fieldValue);
      } catch (NoSuchFieldException e) {
        // skip missing fields
      } catch (IllegalAccessException e) {
        // this should never occur
      }
    }
  }
}
`

  writeSrcFileIfNeeded(file, code)
}
