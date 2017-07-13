# slf4ts-api

Simple Logging Facade for Typescript

Inspired by the popular Java lib [SLF4J](https://www.slf4j.org)

This project is used to abstract logging   
to develop reusable libraies and not force the usage   
of a certain logging framework.

It's meant to be used with `typescript` / `nodejs`.

## LogLevel

* TRACE (numeric value: `0`)
* DEBUG (numeric value: `1`)
* INFO (numeric value: `2`)
* WARN (numeric value: `3`)
* ERROR (numeric value: `4`)

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
```
