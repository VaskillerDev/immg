Implementation [import-maps](https://github.com/WICG/import-maps) generator

## Usage:

```shell
> npx immg --help

Options:
  -b, --baseUrlPath [type]  <string> path to root package.json
  -f, --force [type]        <boolean> if enable - force rewrite previous importmap (default: false)

  -x, --prefix [type]       <string> append prefix to path (default: "") for generate in importsmap

                            example: with arg './module/' in package.importmap.json:
                            "@my/lib": "node_modules/@tc/asynchronous-lib/dist/"
                            generate that:
                            "@my/lib": "./module/node_modules/@tc/asynchronous-lib/dist/"

  -h, --help                display help for command
```

### Example:

```shell
npx immg --baseUrlPath D:/path/to/your/package.json --forceMode true --prefix ./module/
```
or
```shell
> cd path/to/your/project
> npx immg -x ./module/ -f true
```

## Locally install

```shell
npm i https://github.com/VaskillerDev/immg.git -g
```

## Netstat usage:

```shell
> npx immg-netstat --help

Options:
  -p, --pathToFile [type]  <string> path to package.importmap.json
  -u, --baseUrl [type]     <string> base url to server with modules
  -h, --help               display help for command
```

### Example:

```shell
npx immg-netstat -p D:/path/to/your/package.importmap.json -u https://localhost:9000/your/project/root
```

## Todo

- [x] Basic generator import path
- [x] Specifier remapping
- [x] Scoping support
- [x] Web checker access es-module via response code
- [ ] Dynamic import map API
