import 'source-map-support/register'

import {
  pino,
  type DestinationStream,
  type Logger,
  type LoggerOptions
} from 'pino'
import {
  type LoggerImplementation,
  LogLevel,
  type LoggerBuilder,
  LoggerConfiguration
} from 'slf4ts-api'

const LogLevelMapping: string[] = []

LogLevelMapping[LogLevel.TRACE] = 'trace'
LogLevelMapping[LogLevel.DEBUG] = 'debug'
LogLevelMapping[LogLevel.INFO] = 'info'
LogLevelMapping[LogLevel.WARN] = 'warn'
LogLevelMapping[LogLevel.ERROR] = 'error'

/**
 * The actual pino logger implementation.
 *
 * @export
 * @class PinoLoggerImplementation
 * @implements {LoggerImplementation}
 */
export class PinoLoggerImplementation implements LoggerImplementation<Logger, [LoggerOptions | DestinationStream, DestinationStream?]> {
  private readonly rootLoggers = new Map<string, Logger>()
  private readonly loggers = new Map<string, Logger>()
  private builder: LoggerBuilder<Logger, [LoggerOptions | DestinationStream, DestinationStream?]> = (
    config: LoggerOptions | DestinationStream,
    stream?: DestinationStream
  ) => pino(config as LoggerOptions, stream as DestinationStream)

  public async log (...args: any[]): Promise<void> {
    const additionalArguments = [...arguments]
    const commonLoggerData = additionalArguments.splice(0, 3)
    additionalArguments.splice(additionalArguments.length - 1, 1)
    const level: number = commonLoggerData[0]
    const group: string = commonLoggerData[1]
    const name: string = commonLoggerData[2]
    const instance = this.getLoggerInstance(group, name)

    await new Promise<void>((resolve, reject) => {
      const callArguments: any[] = []
      let error: Error | null = null
      let message: string | null = null
      additionalArguments.forEach((arg) => {
        if (arg instanceof Error) {
          error = arg
        } else if (!message && typeof arg === 'string') {
          message = arg
        } else {
          callArguments.push(arg)
        }
      })

      callArguments.push(message)
      if (error) {
        callArguments.unshift(error)
      }

      switch (level) {
        case LogLevel.DEBUG:
          instance.debug.apply(instance, callArguments)
          break
        case LogLevel.INFO:
          instance.info.apply(instance, callArguments)
          break
        case LogLevel.WARN:
          instance.warn.apply(instance, callArguments)
          break
        case LogLevel.ERROR:
          instance.error.apply(instance, callArguments)
          break
        case LogLevel.TRACE:
        default:
          instance.trace.apply(instance, callArguments)
          break
      }
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
    instance.level = LogLevelMapping[logLevel]
  }

  public setMetadata (metadata: any, group: string, name: string): void {
    const compoundKey = `${group}:${name}`
    const rootLogger: Logger | undefined = this.rootLoggers.get(compoundKey)
    if (rootLogger) {
      this.loggers.set(compoundKey, rootLogger.child(metadata))
    }
  }

  public setLoggerBuilder (builder?: LoggerBuilder<Logger, [LoggerOptions | DestinationStream, DestinationStream?]>): void {
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
