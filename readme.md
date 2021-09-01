Implementation [import-maps](https://github.com/WICG/import-maps) generator

## Usage:

```
npx tsc
node dist/index.js ./my-npm-project/package.json false /myOptionalPrefix/
```

## Todo

- [x] Basic generator import path
- [x] Specifier remapping
- [x] Scoping support
- [ ] Dynamic import map API
