import 'source-map-support/register'

import { LoggerImplementation, LogLevel, LoggerBuilder } from 'slf4ts-api'
import * as util from 'util'
import * as winston from 'winston'

const LogLevelMapping: string[] = []

LogLevelMapping[LogLevel.TRACE] = 'silly'
LogLevelMapping[LogLevel.DEBUG] = 'debug'
LogLevelMapping[LogLevel.INFO] = 'info'
LogLevelMapping[LogLevel.WARN] = 'warn'
LogLevelMapping[LogLevel.ERROR] = 'error'

/**
 * The actual winston logger implementation.
 *
 * @export
 * @class WinstonLoggerImplementation
 * @implements {LoggerImplementation}
 */
export class WinstonLoggerImplementation implements LoggerImplementation<winston.Logger, []> {
  private readonly loggers: Map<string, winston.Logger> = new Map();
  private builder: LoggerBuilder<winston.Logger, []> = this.getDefaultLoggerBuilder()

  public async log (...args: any[]): Promise<any> {
    const level: number = arguments[0]
    const group: string = arguments[1]
    const name: string = arguments[2]
    const instance = this.getLoggerInstance(group, name)

    return new Promise<void>((resolve, reject) => {
      const additionalArguments = [...arguments]
      additionalArguments.splice(0, 3)

      let callArguments: any[] = [LogLevelMapping[level]]
      callArguments = callArguments.concat(...additionalArguments)
      const metaArgs = callArguments.splice(2, callArguments.length - 2)
      let metaArg: any
      if (metaArgs && metaArgs.length > 0) {
        metaArg = {}
        metaArgs.forEach((meta) => {
          if (meta) {
            if (meta instanceof Error) {
              metaArg = { ...metaArg, stack: util.inspect(meta) }
            } else if (typeof meta === 'string') {
              callArguments = callArguments.concat(meta)
            } else {
              metaArg = { ...metaArg, ...meta }
            }
          }
        })
      }
      if (metaArg) {
        callArguments = callArguments.concat(metaArg)
      }
      /* callArguments = callArguments.concat((err?: any, lvl?: string, msg?: string, meta?: any) => {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            }); */

      if (instance) {
        instance.log.apply(instance, callArguments)
      } else {
        winston.log.apply(winston, callArguments)
      }

      resolve()
    })
  }

  public getImplementation (group: string, name: string): winston.Logger {
    return this.getLoggerInstance(group, name)
  }

  public setConfig<T>(config: T, group: string, name: string): void {
    const instance = this.getLoggerInstance(group, name)

    if (instance) {
      instance.configure(config)
    }
  }

  public setLogLevel (logLevel: LogLevel, group: string, name: string): void {
    // nothing to set here ...
  }

  public setMetadata (metadata: any, group: string, name: string): void {
    // nothing to set here ...
  }

  public setLoggerBuilder (builder?: LoggerBuilder<winston.Logger, []>): void {
    this.builder = builder ?? this.getDefaultLoggerBuilder()
  }

  private getDefaultLoggerBuilder (): LoggerBuilder<winston.Logger, []> {
    return () => winston.createLogger()
  }

  private getLoggerInstance (group: string, name: string): winston.Logger {
    const compoundKey = `${group}:${name}`
    let instance: winston.Logger = this.loggers.get(compoundKey)

    if (!instance) {
      instance = this.builder()
      this.loggers.set(compoundKey, instance)
    }

    return instance
  }
}
