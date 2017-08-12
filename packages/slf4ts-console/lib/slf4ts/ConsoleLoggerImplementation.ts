import "source-map-support/register";

import {
    LoggerImplementation,
    LogLevel,
} from "slf4ts-api";
import * as util from "util";

/**
 * The actual console logger implementation.
 *
 * @export
 * @class ConsoleLoggerImplementation
 * @implements {LoggerImplementation}
 */
export class ConsoleLoggerImplementation implements LoggerImplementation {

    private console: Console;

    /**
     * Creates an instance of ConsoleLoggerImplementation.
     *
     * @param {Console} [c=global.console] The Node.Console imeplementation.
     * @memberof ConsoleLoggerImplementation
     */
    public constructor(c: Console = global.console) {
        this.console = c;
    }

    /**
     * Gets the console instance passed to the constructor.
     *
     * @template T
     * @returns {T} the console implementation passed to the constructor.
     * @memberof ConsoleLoggerImplementation
     */
    public getImplementation<T>(group: string, name: string): T {
        return this.console as any;
    }

    public setConfig<T>(config: T, group: string, name: string): void {
        // no config for console ...
    }

    /**
     * Log method as described in {@link https://github.com/rstiller/slf4ts-api}.
     *
     * This method forwards the arguments to 'console.[log-level]' or 'console.log' method.
     *
     * @param {...any[]} args
     * @returns {Promise<any>}
     * @memberof ConsoleLoggerImplementation
     */
    public async log(...args: any[]): Promise<any> {
        let loggerName = "";
        const level: number = arguments[0];
        const group: string = arguments[1];
        const name: string = arguments[2];

        if (group && name) {
            loggerName = `${group}.${name}`;
        } else if (group) {
            loggerName = group;
        } else if (name) {
            loggerName = name;
        } else {
            loggerName = "ROOT";
        }

        const logLevelName = LogLevel[level] ? LogLevel[level] : "";
        const logMethodName = logLevelName.toLowerCase();

        let logMethod: (...args: any[]) => void = this.console.log;
        if (level !== LogLevel.DEBUG && logMethodName in this.console && (this.console as any)[logMethodName] instanceof Function) {
            logMethod = (this.console as any)[logMethodName];
        }

        const additionalArguments: any[] = [...arguments];
        additionalArguments.splice(0, 3);
        logMethod.apply(this.console, [util.inspect(new Date()), loggerName, logLevelName].concat(additionalArguments));
    }

}
