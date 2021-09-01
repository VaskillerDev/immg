Implementation [import-maps](https://github.com/WICG/import-maps) generator

## Usage:
```
npx immg --help

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

## Example:
```
npx immg --baseUrlPath D:\path\to\your\package.json --forceMode true --prefix ./module/
```

## Todo

- [x] Basic generator import path
- [x] Specifier remapping
- [x] Scoping support
- [ ] Dynamic import map API
