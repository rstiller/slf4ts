# slf4ts-console

Console Logging-Binding for [slf4ts](https://www.npmjs.org/package/slf4ts-api)

<p align="center">
    <a href="https://www.npmjs.org/package/slf4ts-console">
        <img src="https://img.shields.io/npm/v/slf4ts-console.svg" alt="NPM Version">
    </a>
    <a href="https://www.npmjs.org/package/slf4ts-console">
        <img src="https://img.shields.io/npm/l/slf4ts-console.svg" alt="License">
    </a>
    <a href="https://travis-ci.org/rstiller/slf4ts-console">
        <img src="http://img.shields.io/travis/rstiller/slf4ts-console/master.svg" alt="Build Status">
    </a>
    <a href="https://david-dm.org/rstiller/slf4ts-console">
        <img src="https://img.shields.io/david/rstiller/slf4ts-console.svg" alt="Dependencies Status">
    </a>
</p>

**Status: Work in Progress**

It's meant to be used with `typescript` / `nodejs`.

## Example Usage

Example package.json:

```json
{
    ...,
    "dependencies": {
        "slf4ts-api": "latest",
        "slf4ts-console": "latest"
    },
    ...
}
```

Example code:

```typescript
import { LoggerFactory } from "slf4ts-api";

const ROOT_LOGGER = LoggerFactory.getLogger();
ROOT_LOGGER.setMetadata({ application: 'my-app' });

ROOT_LOGGER.info("Test Message", { version: '1.0.0' }, new Error());
```

Example output:

```text
2017-01-01T12:00:00.999Z ROOT INFO Test Message { application: 'my-app', version: '1.0.0' } Error
    at ConsoleLoggerImplementationTest.checkArgumentPassing (.../slf4ts-console/test/slf4ts/ConsoleLoggerImplementationTest.ts:XXX:XXX)
    at <anonymous>
```

## License

[MIT](https://www.opensource.org/licenses/mit-license.php)
