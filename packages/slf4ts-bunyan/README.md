# slf4ts-bunyan

[bunyan](https://github.com/trentm/node-bunyan#readme) Logging-Binding for [slf4ts](https://www.npmjs.org/package/slf4ts-api)

<p align="center">
    <a href="https://www.npmjs.org/package/slf4ts-bunyan">
        <img src="https://img.shields.io/npm/v/slf4ts-bunyan.svg" alt="NPM Version">
    </a>
    <a href="https://www.npmjs.org/package/slf4ts-bunyan">
        <img src="https://img.shields.io/npm/l/slf4ts-bunyan.svg" alt="License">
    </a>
    <a href="https://david-dm.org/rstiller/slf4ts-bunyan">
        <img src="https://img.shields.io/david/rstiller/slf4ts-bunyan.svg" alt="Dependencies Status">
    </a>
</p>

It's meant to be used with `nodejs`.

## Example Usage

Example package.json:

```json
{
    ...,
    "dependencies": {
        "slf4ts-bunyan": "latest"
    },
    ...
}
```

Example code:

```typescript
import { LoggerFactory, LoggerConfiguration } from "slf4ts-api";

const ROOT_LOGGER = LoggerFactory.getLogger();
ROOT_LOGGER.setMetadata({ application: 'my-app' });

/**
 * prints something like:
 * 
 *  {
 *      "hostname":"...",
 *      "pid":...,
 *      "application":"my-app",
 *      "level":30,
 *      "msg":"Test Message { version: '1.0.0' } Error: \n    at Object.<anonymous> ...",
 *      "time":"...",
 *      "v":0
 *  }
 * 
 * Note that the metadata are extra fields while objects
 * passed to the log-method call are part of the log-message
 */
ROOT_LOGGER.info("Test Message", { version: '1.0.0' }, new Error());
```

## License

[MIT](https://www.opensource.org/licenses/mit-license.php)
