# slf4ts-elasticsearch-log-adapter

[elasticsearch client](https://github.com/elastic/elasticsearch-js) Logging-Adapter for [slf4ts](https://www.npmjs.org/package/slf4ts-api)

<p align="center">
    <a href="https://www.npmjs.org/package/slf4ts-elasticsearch-log-adapter">
        <img src="https://img.shields.io/npm/v/slf4ts-elasticsearch-log-adapter.svg" alt="NPM Version">
    </a>
    <a href="https://www.npmjs.org/package/slf4ts-elasticsearch-log-adapter">
        <img src="https://img.shields.io/npm/l/slf4ts-elasticsearch-log-adapter.svg" alt="License">
    </a>
    <a href="https://travis-ci.org/rstiller/slf4ts-elasticsearch-log-adapter">
        <img src="http://img.shields.io/travis/rstiller/slf4ts-elasticsearch-log-adapter/master.svg" alt="Build Status">
    </a>
    <a href="https://david-dm.org/rstiller/slf4ts-elasticsearch-log-adapter">
        <img src="https://img.shields.io/david/rstiller/slf4ts-elasticsearch-log-adapter.svg" alt="Dependencies Status">
    </a>
</p>

This project is a [log adapter](https://www.elastic.co/guide/en/elasticsearch/client/javascript-api/current/logging.html) using slf4ts logger implementation.  
It's meant to be used with `typescript` / `nodejs`.

## Usage

```typescript
import { ILoggerInstance, LoggerFactory } from "slf4ts-api";

// create an instance of elasticsearch client and an instance of the logging adapter for that client
// creates/uses a logger with group "elasticsearch"
const client = new Client({ log: new ElasticsearchLogAdapter().newLogger() });

const logger: ILoggerInstance = LoggerFactory.getLogger("my-elasticsearch");
// create an instance of elasticsearch client and an instance of the logging adapter with a precreated logger instance
const client = new Client({ log: new ElasticsearchLogAdapter().newLogger(logger) });

// access the underlying logger instance
const logger: ILoggerInstance = LoggerFactory.getLogger("elasticsearch");
logger.setLogLevel(...);
```

## License

[MIT](https://www.opensource.org/licenses/mit-license.php)
