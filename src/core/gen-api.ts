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
import { ClassCode } from './code'

export function genAPI(text: string) {
  const result = parse(text)

  const package_name_list = [
    'controller',
    'service',
    'model',
    'mapper',
    'validator',
  ]
  const app = setupDirectories(package_name_list)

  for (const scope of result.scope_list) {
    setupController(app, scope)
    setupServiceInterface(app, scope)
    setupServiceImpl(app, scope)
  }
  setupMapper(app)
  setupValidator(app)
}

function setupController(app: SpringBootApplication, scope: Scope) {
  const dir = join(app.dir, 'controller')
  mkdirSync(dir, { recursive: true })
  const ClassName = kebab_to_Pascal(scope.name)
  const className = kebab_to_camel(scope.name)
  const file = join(dir, `${ClassName}Controller.java`)

  let classCode = new ClassCode({ file, ClassName: `${ClassName}Controller` })

  for (const api of scope.api_list) {
    let { Name, name } = setupControllerDTO(app, scope, api)

    let Method = u_first(api.method.toLowerCase())
    let methodAnnotation = `@${Method}Mapping`
    let path = api.path
      .replace('/' + scope.prefix, '')
      .replace(/^\//, '')
      .split('/')
      .map(part => (part[0] == ':' ? '{' + part.slice(1) + '}' : part))
      .join('/')
    if (path) {
      methodAnnotation += `("${path}")`
    }

    if (classCode.hasTrimmedLine(methodAnnotation)) continue

    let body = `
  // ${api.method} ${api.path}
  ${methodAnnotation}
  public ${Name}ResponseDTO ${name}(`

    let args: string[] = []

    for (let param of api.params) {
      let ClassName = param.match(/id$/i) ? 'Long' : 'String'
      body += `@PathVariable ${ClassName} ${param}, `
      args.push(param)
    }

    switch (api.method) {
      case 'GET':
      case 'DELETE':
        body += `${Name}RequestDTO ${name}RequestDTO`
        break
      default:
        body += `@RequestBody ${Name}RequestDTO ${name}RequestDTO`
        break
    }
    args.push(`${name}RequestDTO`)

    body += `) {
    // to add validation logic
    return ${className}Service.${name}(${args.join(', ')});
  }`

    classCode.appendInClass(body)
  }

  classCode.setPackage(`${app.package}.controller`)

  classCode.addImportLines(
    `
import ${app.package}.dto.${scope.name}.*;
import ${app.package}.service.${ClassName}Service;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import static ${app.package}.validator.ValidatorUtils.assertNoNull;
`.trim(),
  )

  if (!classCode.hasLine(`@RestController`)) {
    classCode.addBeforeClass(
      `
@RestController
@RequestMapping("${scope.prefix}")
`.trim(),
    )
  }

  if (!classCode.hasLine(`${ClassName}Service ${className}Service;`)) {
    classCode.prependInClass(`  ${ClassName}Service ${className}Service;`)
    classCode.prependInClass(`  @Autowired`)
  }

  classCode.save()
}

function setupServiceInterface(app: SpringBootApplication, scope: Scope) {
  const dir = join(app.dir, 'service')
  const ClassName = kebab_to_Pascal(scope.name)
  const file = join(dir, `${ClassName}Service.java`)

  let body = ''

  for (let api of scope.api_list) {
    let _name_ = apiToName(scope, api)
    let Name = kebab_to_Pascal(_name_)
    let name = kebab_to_camel(_name_)

    let args: string[] = []

    for (let param of api.params) {
      let ClassName = param.match(/id$/i) ? 'Long' : 'String'
      args.push(`${ClassName} ${param}`)
    }
    args.push(`${Name}RequestDTO ${name}RequestDTO`)

    body += `

  ${Name}ResponseDTO ${name}(${args.join(', ')});`
  }

  let code = `
package ${app.package}.service;

import ${app.package}.dto.${scope.name}.*;

public interface ${ClassName}Service {
  ${body.trim()}
}
`

  writeSrcFileIfNeeded(file, code)
}

function setupServiceImpl(app: SpringBootApplication, scope: Scope) {
  const dir = join(app.dir, 'service')
  const ClassName = kebab_to_Pascal(scope.name)
  const className = kebab_to_camel(scope.name)
  const file = join(dir, `${ClassName}ServiceImpl.java`)

  if (existsSync(file)) return

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
${importLines.trim()}
`
    body += `
  @Autowired
  ${ClassName}Repository ${className}Repository;
`
  }

  let code = `
package ${app.package}.service;

${importLines.trim()}

@Service
public class ${ClassName}ServiceImpl implements ${ClassName}Service {`

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

  const dir = join(app.dir, 'dto', scope.name)
  mkdirSync(dir, { recursive: true })

  let packageName = `${app.package}.dto.${scope.name}`

  setupDTOFile(dir, packageName, Name + 'RequestDTO')
  setupDTOFile(dir, packageName, Name + 'ResponseDTO')

  return { _name_, Name, name }
}

function setupDTOFile(dir: string, packageName: string, ClassName: string) {
  const file = join(dir, `${ClassName}.java`)

  if (existsSync(file)) return

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
    for (Field toField : toObject.getClass().getDeclaredFields()) {
      try {
        String fieldName = toField.getName();
        Field fromField = fromClass.getDeclaredField(fieldName);
        fromField.setAccessible(true);
        Object fieldValue = fromField.get(fromObject);
        toField.setAccessible(true);
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

function setupValidator(app: SpringBootApplication) {
  const dir = join(app.dir, 'validator')
  const ClassName = 'ValidatorUtils'
  const file = join(dir, `${ClassName}.java`)

  let code = `
package ${app.package}.validator;

import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

import java.lang.reflect.Field;
import java.util.ArrayList;
import java.util.List;

public class ValidatorUtils {
    public static void assertNoNull(Object object, String objectName) {
        List<String> missingFields = collectNullFields(object);
        if (!missingFields.isEmpty()) {
            fail(HttpStatus.BAD_REQUEST, "missing " + missingFields + " in " + objectName);
        }
    }

    public static void assertNoNull(String objectName, Object object) {
        assertNoNull(object, objectName);
    }

    public static List<String> collectNullFields(Object object) {
        List<String> missingFields = new ArrayList<>();
        for (Field field : object.getClass().getDeclaredFields()) {
            field.setAccessible(true);
            Object value = null;
            try {
                value = field.get(object);
            } catch (IllegalAccessException e) {
                // this should not happen
                throw new RuntimeException(e);
            }
            if (value == null) {
                missingFields.add(field.getName());
                continue;
            }
            if (value.getClass().isEnum() ) {
                continue;
            }
            if (!value.getClass().getName().startsWith("java.")) {
                for (String subFieldName : collectNullFields(value)) {
                    missingFields.add(field.getName() + "." + subFieldName);
                }
            }
        }
        return missingFields;
    }

    public static void fail(HttpStatus httpStatus, String message) {
        throw new ResponseStatusException(httpStatus, message);
    }
}
`

  writeSrcFileIfNeeded(file, code)
}
