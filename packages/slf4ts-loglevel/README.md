# slf4ts-loglevel

[loglevel](https://github.com/pimterry/loglevel) Logging-Binding for [slf4ts](https://www.npmjs.org/package/slf4ts-api)

<p align="center">
    <a href="https://www.npmjs.org/package/slf4ts-loglevel">
        <img src="https://img.shields.io/npm/v/slf4ts-loglevel.svg" alt="NPM Version">
    </a>
    <a href="https://www.npmjs.org/package/slf4ts-loglevel">
        <img src="https://img.shields.io/npm/l/slf4ts-loglevel.svg" alt="License">
    </a>
    <a href="https://david-dm.org/rstiller/slf4ts-loglevel">
        <img src="https://img.shields.io/david/rstiller/slf4ts-loglevel.svg" alt="Dependencies Status">
    </a>
</p>

It's meant to be used with `nodejs`.

## Example Usage

Example package.json:

```json
{
    ...,
    "dependencies": {
        "slf4ts-loglevel": "latest"
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
 *      Test Message { version: '1.0.0' } { application: 'my-app' } Error: 
 *          at Object.<anonymous> ...
 * 
 * Note that all metadata are an extra object passed to the log-method.
 */
ROOT_LOGGER.info("Test Message", { version: '1.0.0' }, new Error());
```

## License

[MIT](https://www.opensource.org/licenses/mit-license.php)
