import 'source-map-support/register'

import * as log from 'loglevel'
import {
  type Logger,
  type LogLevelDesc
} from 'loglevel'
import {
  type LoggerImplementation,
  LogLevel,
  type LoggerBuilder,
  LoggerConfiguration
} from 'slf4ts-api'

const LogLevelMapping: LogLevelDesc[] = []

LogLevelMapping[LogLevel.TRACE] = 'trace'
LogLevelMapping[LogLevel.DEBUG] = 'debug'
LogLevelMapping[LogLevel.INFO] = 'info'
LogLevelMapping[LogLevel.WARN] = 'warn'
LogLevelMapping[LogLevel.ERROR] = 'error'

type LogMethodId = 'trace' | 'debug' | 'info' | 'warn' | 'error'

const LogMethodMapping: LogMethodId[] = []

LogMethodMapping[LogLevel.TRACE] = 'trace'
LogMethodMapping[LogLevel.DEBUG] = 'debug'
LogMethodMapping[LogLevel.INFO] = 'info'
LogMethodMapping[LogLevel.WARN] = 'warn'
LogMethodMapping[LogLevel.ERROR] = 'error'

/**
 * The actual loglevel logger implementation.
 *
 * @export
 * @class LoglevelLoggerImplementation
 * @implements {LoggerImplementation}
 */
export class LoglevelLoggerImplementation implements LoggerImplementation<Logger, [string]> {
  private readonly loggers = new Map<string, Logger>()
  private builder: LoggerBuilder<Logger, [string]> = (name: string) => {
    if (name === ':') {
      return log
    }
    return log.getLogger(name)
  }

  public async log (...args: any[]): Promise<void> {
    const additionalArguments = [...args]
    const commonLoggerData = additionalArguments.splice(0, 3)
    const level: number = commonLoggerData[0]
    const group: string = commonLoggerData[1]
    const name: string = commonLoggerData[2]
    const instance = this.getLoggerInstance(group, name)

    if (!additionalArguments[additionalArguments.length - 1]) {
      additionalArguments.pop()
    }

    const logMethodId: LogMethodId = LogMethodMapping[level]
    const logMethod = instance[logMethodId]
    logMethod(...additionalArguments)
  }

  public getImplementation (group: string, name: string): Logger {
    return this.getLoggerInstance(group, name)
  }

  public setConfig<T>(config: T, group: string, name: string): void {
    // nothing to configure here
  }

  public setLogLevel (logLevel: LogLevel, group: string, name: string): void {
    const instance = this.getLoggerInstance(group, name)
    instance.setLevel(LogLevelMapping[logLevel])
  }

  public setMetadata (metadata: any, group: string, name: string): void {
    // nothing to do here
  }

  public setLoggerBuilder (builder?: LoggerBuilder<Logger, [string]>): void {
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
      instance = this.builder(compoundKey)
      instance.setLevel(LogLevelMapping[level])
      this.loggers.set(compoundKey, instance)
    }

    return instance
  }
}
