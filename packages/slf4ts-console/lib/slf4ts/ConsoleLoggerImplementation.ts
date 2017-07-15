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
     * Log method as described in {@link https://github.com/rstiller/slf4ts-api}.
     *
     * This method forwards the arguments to 'console.[log-level]' or 'console.log' method.
     * The Error argument is only forwarded if it exists.
     *
     * @param {LogLevel} level
     * @param {string} group
     * @param {string} name
     * @param {string} message
     * @param {Error} error
     * @param {*} metadata
     * @returns {Promise<any>}
     * @memberof ConsoleLoggerImplementation
     */
    public async log(level: LogLevel, group: string, name: string, message: string, error: Error, metadata: any): Promise<any> {
        let loggerName = "";

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

        const args: any[] = [];
        if (metadata) {
            args.push(util.inspect(metadata));
        }
        if (error) {
            args.push(error);
        }

        logMethod(util.inspect(new Date()), loggerName, logLevelName, message, ...args);
    }

}
