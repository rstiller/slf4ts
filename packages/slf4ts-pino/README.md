# slf4ts-pino

[pino](https://getpino.io/#/) Logging-Binding for [slf4ts](https://www.npmjs.org/package/slf4ts-api)

<p align="center">
    <a href="https://www.npmjs.org/package/slf4ts-pino">
        <img src="https://img.shields.io/npm/v/slf4ts-pino.svg" alt="NPM Version">
    </a>
    <a href="https://www.npmjs.org/package/slf4ts-pino">
        <img src="https://img.shields.io/npm/l/slf4ts-pino.svg" alt="License">
    </a>
    <a href="https://david-dm.org/rstiller/slf4ts-pino">
        <img src="https://img.shields.io/david/rstiller/slf4ts-pino.svg" alt="Dependencies Status">
    </a>
</p>

It's meant to be used with `nodejs`.

## Example Usage

Example package.json:

```json
{
    ...,
    "dependencies": {
        "slf4ts-pino": "latest"
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
 *      "level":30,
 *      "time":...,
 *      "pid":...,
 *      "hostname":"...",
 *      "application":"my-app",
 *      "msg":"Test Message { \"version\": \"1.0.0\" }",
 *      "stack":"Error: \n ...",
 *      "type":"Error",
 *      "v":1
 *  }
 * 
 * Note that the metadata are extra fields while objects
 * passed to the log-method call are part of the log-message,
 * except for instances of Error
 */
ROOT_LOGGER.info("Test Message", { version: '1.0.0' }, new Error());
```

## License

[MIT](https://www.opensource.org/licenses/mit-license.php)
