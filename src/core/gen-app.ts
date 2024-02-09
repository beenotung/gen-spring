import { existsSync, mkdirSync, writeFileSync } from 'fs'
import { ask } from 'npm-init-helper'
import { basename, join } from 'path'
import { kebab_to_Pascal } from '../utils/case'

async function askUntilValid(
  fn: () => Promise<string | void>,
): Promise<string> {
  for (;;) {
    let res = await fn()
    if (res) return res
  }
}

export async function setupSpringBootApplication() {
  if (existsSync('pom.xml') || existsSync(join('src', 'main', 'resources'))) {
    return
  }
  console.log('springboot application is not found, going to create it...')

  let app_package = await askUntilValid(async () => {
    if (!process.stdin.isTTY) {
      console.error('Error: cannot ask for package name when using pipe')
      console.log(
        'Please run this cli without pipe to setup the springboot application, then run it again with api text from pipe.',
      )
      process.exit(1)
    }
    let input = await ask(
      'springboot application package (example: com.example.project1): ',
    )
    input = input.trim().toLowerCase()
    let package_parts = input.split('.')
    let is_valid =
      package_parts.length > 0 && input.split('.').every(s => s.match(/^\w+$/))
    if (!is_valid) {
      console.error('Error: invalid package name')
      return
    }
    return input
  })
  let package_parts = app_package.split('.')

  let project_name = basename(process.cwd())
  let group_id = package_parts.slice(0, package_parts.length - 1).join('.')

  let app_class =
    kebab_to_Pascal(project_name.replace(/^[0-9]+/, '')).replace(/App$/, '') +
    'Application'

  mkdirSync(join('src', 'main', 'resources'), { recursive: true })
  mkdirSync(join('src', 'main', 'java', ...package_parts), { recursive: true })
  mkdirSync(join('src', 'test', 'java', ...package_parts), { recursive: true })

  /* HELP.md */
  writeFileSync(
    'HELP.md',
    `
# Getting Started

### Reference Documentation

For further reference, please consider the following sections:

- [Official Apache Maven documentation](https://maven.apache.org/guides/index.html)
- [Spring Boot Maven Plugin Reference Guide](https://docs.spring.io/spring-boot/docs/3.1.4/maven-plugin/reference/html/)
- [Create an OCI image](https://docs.spring.io/spring-boot/docs/3.1.4/maven-plugin/reference/html/#build-image)
- [Spring Web](https://docs.spring.io/spring-boot/docs/3.1.4/reference/htmlsingle/index.html#web)
- [Spring Boot DevTools](https://docs.spring.io/spring-boot/docs/3.1.4/reference/htmlsingle/index.html#using.devtools)
- [Spring Data JPA](https://docs.spring.io/spring-boot/docs/3.1.4/reference/htmlsingle/index.html#data.sql.jpa-and-spring-data)

### Guides

The following guides illustrate how to use some features concretely:

- [Building a RESTful Web Service](https://spring.io/guides/gs/rest-service/)
- [Serving Web Content with Spring MVC](https://spring.io/guides/gs/serving-web-content/)
- [Building REST services with Spring](https://spring.io/guides/tutorials/rest/)
- [Accessing Data with JPA](https://spring.io/guides/gs/accessing-data-jpa/)

### Code Generation

The follow tools support automatic code generation:

- [Generate API files](https://github.com/beenotung/gen-spring/blob/master/README.md)
- [Generate database files](https://github.com/beenotung/quick-erd/blob/master/README.md)
`.trim() + '\n',
  )

  /* pom.xml */
  writeFileSync(
    'pom.xml',
    `
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 https://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>
    <parent>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-parent</artifactId>
        <version>3.1.4</version>
        <relativePath/> <!-- lookup parent from repository -->
    </parent>
    <groupId>${group_id}</groupId>
    <artifactId>${project_name}</artifactId>
    <version>0.0.1-SNAPSHOT</version>
    <name>${project_name}</name>
    <description>${project_name}</description>
    <properties>
        <java.version>17</java.version>
    </properties>
    <dependencies>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-data-jpa</artifactId>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
        </dependency>

        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-devtools</artifactId>
            <scope>runtime</scope>
            <optional>true</optional>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-test</artifactId>
            <scope>test</scope>
        </dependency>
        <dependency>
            <groupId>com.h2database</groupId>
            <artifactId>h2</artifactId>
            <version>2.2.224</version>
        </dependency>
    </dependencies>

    <build>
        <plugins>
            <plugin>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-maven-plugin</artifactId>
            </plugin>
        </plugins>
    </build>

</project>
`.trim() + '\n',
  )

  /* application.properties */
  writeFileSync(
    join('src', 'main', 'resources', 'application.properties'),
    `
spring.datasource.url=jdbc:h2:mem:testdb
spring.datasource.driverClassName=org.h2.Driver
spring.datasource.username=sa
spring.datasource.password=password
spring.jpa.database-platform=org.hibernate.dialect.H2Dialect

server.error.include-stacktrace=never
`.trim() + '\n',
  )

  /* SpringBootApplication */
  writeFileSync(
    join('src', 'main', 'java', ...package_parts, app_class + '.java'),
    `
package ${app_package};

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class ${app_class} {

    public static void main(String[] args) {
        SpringApplication.run(${app_class}.class, args);
    }

}
`.trim() + '\n',
  )

  /* SpringBootApplication Tests */
  writeFileSync(
    join('src', 'test', 'java', ...package_parts, app_class + 'Tests.java'),
    `
package ${app_package};

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
class ${app_class}Tests {

    @Test
    void contextLoads() {
    }

}
`.trim() + '\n',
  )

  console.log('Created springboot project.')
  console.log('Please run this cli again with api text from pipe.')
  process.exit(0)
}
