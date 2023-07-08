import 'source-map-support/register'

import { type LoggerImplementation, LogLevel, type LoggerBuilder } from 'slf4ts-api'
import { getLogger, type Logger } from 'log4js'

const LogLevelMapping: string[] = []

LogLevelMapping[LogLevel.TRACE] = 'TRACE'
LogLevelMapping[LogLevel.DEBUG] = 'DEBUG'
LogLevelMapping[LogLevel.INFO] = 'INFO'
LogLevelMapping[LogLevel.WARN] = 'WARN'
LogLevelMapping[LogLevel.ERROR] = 'ERROR'

/**
 * The actual log4js logger implementation.
 *
 * @export
 * @class Log4JSLoggerImplementation
 * @implements {LoggerImplementation}
 */
export class Log4JSLoggerImplementation implements LoggerImplementation<Logger, [string]> {
  private readonly loggers = new Map<string, Logger>()
  private builder: LoggerBuilder<Logger, [string]> = (category: string) => getLogger(category)

  public async log (...args: any[]): Promise<any> {
    const additionalArguments = [...arguments]
    const commonLoggerData = additionalArguments.splice(0, 3)
    // remove metadata
    additionalArguments.splice(additionalArguments.length - 1, 1)
    const level: number = commonLoggerData[0]
    const group: string = commonLoggerData[1]
    const name: string = commonLoggerData[2]
    const instance = this.getLoggerInstance(group, name)
    const callArguments: any[] = [LogLevelMapping[level]]
      .concat(...additionalArguments)

    await new Promise<void>((resolve, reject) => {
      instance.log.apply(instance, callArguments)
      resolve()
    })
  }

  public getImplementation (group: string, name: string): any {
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
    const instance = this.getLoggerInstance(group, name)
    instance.clearContext()
    if (metadata) {
      Object.entries(metadata).forEach(([key, value]) => {
        instance.addContext(key, value)
      })
    }
  }

  public setLoggerBuilder (builder?: LoggerBuilder<Logger, [string]>): void {
    this.builder = builder ?? this.builder
  }

  private getLoggerInstance (group: string, name: string): Logger {
    const compoundKey = `${group}:${name}`
    let instance: Logger | undefined = this.loggers.get(compoundKey)

    if (!instance) {
      instance = this.builder(compoundKey)
      this.loggers.set(compoundKey, instance)
    }

    return instance
  }
}
