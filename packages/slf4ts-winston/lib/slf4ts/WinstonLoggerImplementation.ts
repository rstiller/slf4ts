import "source-map-support/register";

import { LoggerImplementation, LogLevel } from "slf4ts-api";
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

    public async log(level: LogLevel, group: string, name: string, message: string, error: Error, metadata: any): Promise<any> {
        const instance = this.getLoggerInstance(group, name);

        return new Promise((resolve, reject) => {
            if (instance) {
                instance.log(LogLevelMapping[level], message, metadata, error, (err?: any, lvl?: string, msg?: string, meta?: any) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve();
                    }
                });
            } else {
                winston.log(LogLevelMapping[level], message, metadata, error, (err?: any, lvl?: string, msg?: string, meta?: any) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve();
                    }
                });
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
