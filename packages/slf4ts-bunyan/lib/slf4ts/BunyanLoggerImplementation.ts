import 'source-map-support/register'

import * as Logger from 'bunyan'
import {
  LoggerImplementation,
  LogLevel,
  LoggerBuilder,
  LoggerConfiguration
} from 'slf4ts-api'

const LogLevelMapping: number[] = []

LogLevelMapping[LogLevel.TRACE] = Logger.resolveLevel('trace')
LogLevelMapping[LogLevel.DEBUG] = Logger.resolveLevel('debug')
LogLevelMapping[LogLevel.INFO] = Logger.resolveLevel('info')
LogLevelMapping[LogLevel.WARN] = Logger.resolveLevel('warn')
LogLevelMapping[LogLevel.ERROR] = Logger.resolveLevel('error')

type LogMethodId = 'trace' | 'debug' | 'info' | 'warn' | 'error'

const LogMethodMapping: LogMethodId[] = []

LogMethodMapping[LogLevel.TRACE] = 'trace'
LogMethodMapping[LogLevel.DEBUG] = 'debug'
LogMethodMapping[LogLevel.INFO] = 'info'
LogMethodMapping[LogLevel.WARN] = 'warn'
LogMethodMapping[LogLevel.ERROR] = 'error'

/**
 * The actual bunyan logger implementation.
 *
 * @export
 * @class BunyanLoggerImplementation
 * @implements {LoggerImplementation}
 */
export class BunyanLoggerImplementation implements LoggerImplementation<Logger, [Logger.LoggerOptions]> {
  private readonly loggers: Map<string, Logger> = new Map();
  private readonly rootLoggers: Map<string, Logger> = new Map();
  private builder: LoggerBuilder<any, [Logger.LoggerOptions]> = this.getDefaultLoggerBuilder()

  public async log (...args: any[]): Promise<void> {
    const additionalArguments = [...args]
    const commonLoggerData = additionalArguments.splice(0, 3)
    additionalArguments.splice(additionalArguments.length - 1, 1)
    const level: number = commonLoggerData[0]
    const group: string = commonLoggerData[1]
    const name: string = commonLoggerData[2]
    const instance = this.getLoggerInstance(group, name)

    return new Promise((resolve, reject) => {
      const logMethodId: LogMethodId = LogMethodMapping[level]
      const logMethod = instance[logMethodId]
      logMethod.apply(instance, additionalArguments)
      resolve()
    })
  }

  public getImplementation (group: string, name: string): Logger {
    return this.getLoggerInstance(group, name)
  }

  public setConfig<T>(config: T, group: string, name: string): void {
    // nothing to configure here
  }

  public setLogLevel (logLevel: LogLevel, group: string, name: string): void {
    const instance = this.getLoggerInstance(group, name)
    instance.level(LogLevelMapping[logLevel])
  }

  public setMetadata (metadata: any, group: string, name: string): void {
    const compoundKey = `${group}:${name}`
    const rootLogger: Logger = this.rootLoggers.get(compoundKey)
    this.loggers.set(compoundKey, rootLogger.child(metadata))
  }

  public setLoggerBuilder (builder?: LoggerBuilder<Logger, [Logger.LoggerOptions]>): void {
    this.builder = builder ?? this.getDefaultLoggerBuilder()
  }

  private getDefaultLoggerBuilder (): LoggerBuilder<Logger, [Logger.LoggerOptions]> {
    return (options: Logger.LoggerOptions) => Logger.createLogger(options)
  }

  private getLoggerInstance (
    group: string,
    name: string
  ): Logger {
    const compoundKey = `${group}:${name}`
    let instance: Logger = this.loggers.get(compoundKey)

    if (!instance) {
      const level = LoggerConfiguration.getLogLevel(group, name)
      instance = this.builder({
        name: compoundKey,
        level: LogLevelMapping[level]
      })
      this.rootLoggers.set(compoundKey, instance)
      this.loggers.set(compoundKey, instance)
    }

    return instance
  }
}
