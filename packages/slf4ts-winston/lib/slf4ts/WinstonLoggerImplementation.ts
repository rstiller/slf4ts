import "source-map-support/register";

import { LoggerImplementation, LogLevel } from "slf4ts-api";
import * as util from "util";
import * as winston from "winston";

const LogLevelMapping: string[] = [];

LogLevelMapping[LogLevel.TRACE] = "silly";
LogLevelMapping[LogLevel.DEBUG] = "debug";
LogLevelMapping[LogLevel.INFO] = "info";
LogLevelMapping[LogLevel.WARN] = "warn";
LogLevelMapping[LogLevel.ERROR] = "error";

/**
 * The actual winston logger implementation.
 *
 * @export
 * @class WinstonLoggerImplementation
 * @implements {LoggerImplementation}
 */
export class WinstonLoggerImplementation implements LoggerImplementation {

    private loggers: Map<string, winston.LoggerInstance> = new Map();

    public async log(...args: any[]): Promise<any> {
        const level: number = arguments[0];
        const group: string = arguments[1];
        const name: string = arguments[2];
        const instance = this.getLoggerInstance(group, name);

        return new Promise((resolve, reject) => {
            const additionalArguments = [...arguments];
            additionalArguments.splice(0, 3);

            let callArguments: any[] = [LogLevelMapping[level]];
            callArguments = callArguments.concat(...additionalArguments);
            const metaArgs = callArguments.splice(2, callArguments.length - 2);
            let metaArg: any;
            if (metaArgs && metaArgs.length > 0) {
                metaArg = {};
                metaArgs.forEach((meta) => {
                    if (meta) {
                        if (meta instanceof Error) {
                            metaArg = { ...metaArg, stack: util.inspect(meta) };
                        } else if (typeof meta === "string") {
                            callArguments = callArguments.concat(meta);
                        } else {
                            metaArg = { ...metaArg, ...meta };
                        }
                    }
                });
            }
            if (metaArg) {
                callArguments = callArguments.concat(metaArg);
            }
            callArguments = callArguments.concat((err?: any, lvl?: string, msg?: string, meta?: any) => {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            });

            if (instance) {
                instance.log.apply(instance, callArguments);
            } else {
                winston.log.apply(winston, callArguments);
            }
        });
    }

    public getImplementation(group: string, name: string): any {
        return this.getLoggerInstance(group, name);
    }

    public setConfig<T>(config: T, group: string, name: string): void {
        const instance = this.getLoggerInstance(group, name);

        if (instance) {
            instance.configure(config);
        }
    }

    private getLoggerInstance(group: string, name: string): winston.LoggerInstance {
        const compoundKey = `${group}:${name}`;
        let instance: winston.LoggerInstance = this.loggers.get(compoundKey);

        if (!instance) {
            instance = new winston.Logger();
            this.loggers.set(compoundKey, instance);
        }

        return instance;
    }

}
