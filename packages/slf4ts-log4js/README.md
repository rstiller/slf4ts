# slf4ts-log4js

[log4js](https://log4js-node.github.io/log4js-node/) Logging-Binding for [slf4ts](https://www.npmjs.org/package/slf4ts-api)

<p align="center">
    <a href="https://www.npmjs.org/package/slf4ts-log4js">
        <img src="https://img.shields.io/npm/v/slf4ts-log4js.svg" alt="NPM Version">
    </a>
    <a href="https://www.npmjs.org/package/slf4ts-log4js">
        <img src="https://img.shields.io/npm/l/slf4ts-log4js.svg" alt="License">
    </a>
    <a href="https://david-dm.org/rstiller/slf4ts-log4js">
        <img src="https://img.shields.io/david/rstiller/slf4ts-log4js.svg" alt="Dependencies Status">
    </a>
</p>

It's meant to be used with `nodejs`.

## Example Usage

Example package.json:

```json
{
    ...,
    "dependencies": {
        "slf4ts-log4js": "latest"
    },
    ...
}
```

Example code:

```typescript
import { configure } from "log4js";
import { LoggerFactory, LoggerConfiguration } from "slf4ts-api";

const ROOT_LOGGER = LoggerFactory.getLogger();
ROOT_LOGGER.setMetadata({ application: 'my-app' });

// configure log4js as usual
configure({
  appenders: {
    out: { type: 'stdout' },
    app: { type: 'file', filename: 'application.log' }
  },
  categories: {
    default: { appenders: [ 'out', 'app' ], level: 'debug' }
  }
});

/**
 * prints something like:
 * 
 *      [2020-01-01T11:22:33.444] [INFO] default - Test Message { version: '1.0.0' } Error: 
 *          at Object.<anonymous> (...)
 *          at Module._compile (internal/modules/cjs/loader.js:1151:30)
 *          at Object.Module._extensions..js (internal/modules/cjs/loader.js:1171:10)
 *          at Module.load (internal/modules/cjs/loader.js:1000:32)
 *          at Function.Module._load (internal/modules/cjs/loader.js:899:14)
 *          at Function.executeUserEntryPoint [as runMain] (internal/modules/run_main.js:71:12)
 *          at internal/main/run_main_module.js:17:47
 * 
 * { application: 'my-app' } (metadata set above) is present in the context of the logger.
 */
ROOT_LOGGER.info("Test Message", { version: '1.0.0' }, new Error());
```

## License

[MIT](https://www.opensource.org/licenses/mit-license.php)
