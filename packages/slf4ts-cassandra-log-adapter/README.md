# slf4ts-cassandra-log-adapter

[Cassandra](https://github.com/datastax/nodejs-driver) Logging-Adapter for [slf4ts](https://www.npmjs.org/package/slf4ts-api)

<p align="center">
    <a href="https://www.npmjs.org/package/slf4ts-cassandra-log-adapter">
        <img src="https://img.shields.io/npm/v/slf4ts-cassandra-log-adapter.svg" alt="NPM Version">
    </a>
    <a href="https://www.npmjs.org/package/slf4ts-cassandra-log-adapter">
        <img src="https://img.shields.io/npm/l/slf4ts-cassandra-log-adapter.svg" alt="License">
    </a>
    <a href="https://david-dm.org/rstiller/slf4ts-cassandra-log-adapter">
        <img src="https://img.shields.io/david/rstiller/slf4ts-cassandra-log-adapter.svg" alt="Dependencies Status">
    </a>
</p>

This project forwards log events from datastax cassandra driver to slf4ts logger implementation.  
It's s meant to be used with `nodejs`.

## Usage

```typescript
import { ILoggerInstance, LoggerFactory } from "slf4ts-api";

// create an instance of Client
const client = new Client({ contactPoints: ["127.0.0.1:9042"] });

// Create an instance of the logging adapter for each client
// creates/uses a logger with group "cassandra" and the keyspace of the client as name (empty string if not configured) 
new CassandraLogAdapter(client);

// Create an instance of the logging adapter with a pre-created logger instance
const logger: ILoggerInstance = LoggerFactory.getLogger("my-cassandra");
new CassandraLogAdapter(client, logger);

// use the client as usual
client.connect(() => {
    ...
});

// access the underlying logger instance
const logger: ILoggerInstance = LoggerFactory.getLogger("cassandra", client.keyspace);
logger.setLogLevel(...);
```

## License

[MIT](https://www.opensource.org/licenses/mit-license.php)
