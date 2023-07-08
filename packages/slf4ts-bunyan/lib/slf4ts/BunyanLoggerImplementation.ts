import 'source-map-support/register'

import * as Logger from 'bunyan'
import {
  type LoggerImplementation,
  LogLevel,
  type LoggerBuilder,
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
  private readonly loggers = new Map<string, Logger>()
  private readonly rootLoggers = new Map<string, Logger>()
  private builder: LoggerBuilder<any, [Logger.LoggerOptions]> = (options: Logger.LoggerOptions) => Logger.createLogger(options)

  public async log (...args: any[]): Promise<void> {
    const additionalArguments = [...args]
    const commonLoggerData = additionalArguments.splice(0, 3)
    additionalArguments.splice(additionalArguments.length - 1, 1)
    const level: number = commonLoggerData[0]
    const group: string = commonLoggerData[1]
    const name: string = commonLoggerData[2]
    const instance = this.getLoggerInstance(group, name)

    await new Promise<void>((resolve, reject) => {
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
    const rootLogger: Logger | undefined = this.rootLoggers.get(compoundKey)
    if (rootLogger) {
      this.loggers.set(compoundKey, rootLogger.child(metadata))
    }
  }

  public setLoggerBuilder (builder?: LoggerBuilder<Logger, [Logger.LoggerOptions]>): void {
    this.builder = builder ?? this.builder
  }

  private getLoggerInstance (
    group: string,
    name: string
  ): Logger {
    const compoundKey = `${group}:${name}`
    let instance: Logger | undefined = this.loggers.get(compoundKey)

    if (!instance) {
      const level = LoggerConfiguration.getLogLevel(group, name)
      const newInstance = this.builder({
        name: compoundKey,
        level: LogLevelMapping[level]
      })
      this.rootLoggers.set(compoundKey, newInstance)
      this.loggers.set(compoundKey, newInstance)
      instance = newInstance
    }

    return instance as Logger
  }
}
