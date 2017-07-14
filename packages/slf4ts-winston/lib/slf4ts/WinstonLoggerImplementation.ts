import "source-map-support/register";

import {
    LoggerImplementation,
    LogLevel,
} from "slf4ts-api";

/**
 * The actual winston logger implementation.
 *
 * @export
 * @class WinstonLoggerImplementation
 * @implements {LoggerImplementation}
 */
export class WinstonLoggerImplementation implements LoggerImplementation {

    public async log(level: LogLevel, group: string, name: string, message: string, error: Error, metadata: any): Promise<any> {
    }

}
