# slf4ts-winston

[Winston](https://github.com/winstonjs/winston) Logging-Binding for [slf4ts](https://www.npmjs.org/package/slf4ts-api)

<p align="center">
    <a href="https://www.npmjs.org/package/slf4ts-winston">
        <img src="https://img.shields.io/npm/v/slf4ts-winston.svg" alt="NPM Version">
    </a>
    <a href="https://www.npmjs.org/package/slf4ts-winston">
        <img src="https://img.shields.io/npm/l/slf4ts-winston.svg" alt="License">
    </a>
    <a href="https://travis-ci.org/rstiller/slf4ts-winston">
        <img src="http://img.shields.io/travis/rstiller/slf4ts-winston/master.svg" alt="Build Status">
    </a>
    <a href="https://david-dm.org/rstiller/slf4ts-winston">
        <img src="https://img.shields.io/david/rstiller/slf4ts-winston.svg" alt="Dependencies Status">
    </a>
</p>

**Status: Work in Progress**

It's meant to be used with `typescript` / `nodejs`.

Currently not supported:

* using custom log-levels

## Example Usage

Example package.json:

```json
{
    ...,
    "dependencies": {
        "slf4ts-winston": "latest"
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
```

## License

[MIT](https://www.opensource.org/licenses/mit-license.php)
