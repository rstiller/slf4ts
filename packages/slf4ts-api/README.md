# slf4ts-api

Simple Logging Facade for Typescript

<p align="center">
    <a href="https://www.npmjs.org/package/slf4ts-api">
        <img src="https://img.shields.io/npm/v/slf4ts-api.svg" alt="NPM Version">
    </a>
    <a href="https://www.npmjs.org/package/slf4ts-api">
        <img src="https://img.shields.io/npm/l/slf4ts-api.svg" alt="License">
    </a>
    <a href="https://travis-ci.org/rstiller/slf4ts-api">
        <img src="http://img.shields.io/travis/rstiller/slf4ts-api/master.svg" alt="Build Status">
    </a>
    <a href="https://david-dm.org/rstiller/slf4ts-api">
        <img src="https://img.shields.io/david/rstiller/slf4ts-api.svg" alt="Dependencies Status">
    </a>
</p>


**Status: Work in Progress**

Inspired by the popular Java lib [SLF4J](https://www.slf4j.org)

This project is used to abstract logging   
to develop reusable libraies and not force the usage   
of a certain logging framework.

It's meant to be used with `typescript` / `nodejs`.

## LogLevel

* TRACE (numeric value: `4`)
* DEBUG (numeric value: `3`)
* INFO (numeric value: `2`)
* WARN (numeric value: `1`)
* ERROR (numeric value: `0`)

## Logger Implementations

slf4ts doesn't work without a logging-framework binding.   
Bindings exist for a couple of logging-frameworks:

* [console](https://github.com/rstiller/slf4ts-console)
* [winston](https://github.com/rstiller/slf4ts-winston)

### Write a binding

A binding for a logging-framework needs to implement the `LoggerBinding` interface and   
the actual logger interface `LoggerImplementation`.   
Also a file named `.slf4ts-binding` needs to be present in the package folder (can be empty).   

A node package for a binding should export a single function that is used during binding discovery.

Interfaces to implement:

```typescript
import { LogLevel } from "slf4ts-api";

interface LoggerImplementation {
    log(level: LogLevel,
        group: string,
        name: string,
        message: string,
        error: Error,
        metadata: any): Promise<any>;
    getImplementation<T>(): T;
    setConfig<T>(config: T, group: string, name: string): void;
}

interface LoggerBinding {
    getLoggerImplementation(): LoggerImplementation;
    getVendor(): string;
    getVersion(): string;
}
```

Sample implementation in typescript (index.ts):

```typescript
import { LoggerBindings } from "slf4ts-api";

export default function(bindings: LoggerBindings) {
    bindings.registerBinding({
        getLoggerImplementation: () => { ... },
        getVendor: () => "My Logger Binding Implementation",
        getVersion: () => "1.0.0"
    });
}

```

An example implementation can be found in the `example-node-modules` folder of this project.

## Usage

```typescript
import { LoggerConfiguration, LogLevel, LoggerFactory } from "slf4ts-api";

// gets the root logger (group "" and name "")
const ROOT_LOGGER = LoggerFactory.getLogger();

class X {

    // gets a logger with group "my-lib" and name "X"
    private static LOG = LoggerFactory.getLogger("my-lib", "X");

    public async something(value: any) {
        // log with debug level and some metadata
        X.LOG.debug(`a message with ${value}`, { additionalData: "Testvalue" });

        try {
            ...
        } catch(error: Error) {
            // logs an error without metadata
            X.LOG.error('Error!', error);
        }
    }

}

// sets the log level of all loggers
LoggerConfiguration.setLogLevel(LogLevel.INFO);

// sets the log level of all loggers within group "my-lib"
LoggerConfiguration.setLogLevel(LogLevel.WARN, "my-lib");

// sets the log level of the logger with group "my-lib" and name "X"
LoggerConfiguration.setLogLevel(LogLevel.ERROR, "my-lib", "X");

const config = {
    transports: [...],
    events: [...],
    postProcessor: () => { ... }
};

// sets the config of all loggers
LoggerConfiguration.setConfig(config);

// sets the config of all loggers within group "my-lib"
LoggerConfiguration.setConfig(config, "my-lib");

// sets the config of the logger with group "my-lib" and name "X"
LoggerConfiguration.setConfig(config, "my-lib", "X");
```

## License

[MIT](https://www.opensource.org/licenses/mit-license.php)
