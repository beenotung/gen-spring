# gen-spring

Generate Spring Boot Controller, Service, DTO from API list in plain text

[![npm Package Version](https://img.shields.io/npm/v/gen-spring)](https://www.npmjs.com/package/gen-spring)

## Installation (optional)

This package can be installed as devDependencies to lock specific version and reduce startup overhead

```bash
npm i -D gen-spring
```

## Usage

`gen-spring [db] < [api-file]`

The `db` argument can be skipped if `DB_CLIENT` exists in the environment variable or in the `.env` file.

### Usage Example

```
npx -y gen-spring h2 < api.txt
```

## License

This project is licensed with [BSD-2-Clause](./LICENSE)

This is free, libre, and open-source software. It comes down to four essential freedoms [[ref]](https://seirdy.one/2021/01/27/whatsapp-and-the-domestication-of-users.html#fnref:2):

- The freedom to run the program as you wish, for any purpose
- The freedom to study how the program works, and change it so it does your computing as you wish
- The freedom to redistribute copies so you can help others
- The freedom to distribute copies of your modified versions to others
