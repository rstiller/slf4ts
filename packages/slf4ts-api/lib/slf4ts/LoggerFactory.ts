import 'source-map-support/register'

import { LoggerBindings, type LoggerImplementation, type LoggerBuilder } from './LoggerBindings'
import { LoggerConfiguration, LogLevel } from './LoggerConfiguration'

/**
 * Interface representing a logger instance.
 *
 * @export
 * @interface ILoggerInstance
 */
export interface ILoggerInstance<T> {
  /**
     * Logs the given message using TRACE log-level.
     *
     * @param {...args: any[]} [args] messages, metadata and errors to log.
     * @returns {Promise<any>} A promise completing when the logging-implementation processed the log statement.
     * @memberof ILoggerInstance
     */
  trace: (...args: any[]) => Promise<any>
  /**
     * Logs the given message using DEBUG log-level.
     *
     * @param {...args: any[]} [args] messages, metadata and errors to log.
     * @returns {Promise<any>} A promise completing when the logging-implementation processed the log statement.
     * @memberof ILoggerInstance
     */
  debug: (...args: any[]) => Promise<any>
  /**
     * Logs the given message using INFO log-level.
     *
     * @param {...args: any[]} [args] messages, metadata and errors to log.
     * @returns {Promise<any>} A promise completing when the logging-implementation processed the log statement.
     * @memberof ILoggerInstance
     */
  info: (...args: any[]) => Promise<any>
  /**
     * Logs the given message using WARN log-level.
     *
     * @param {...args: any[]} [args] messages, metadata and errors to log.
     * @returns {Promise<any>} A promise completing when the logging-implementation processed the log statement.
     * @memberof ILoggerInstance
     */
  warn: (...args: any[]) => Promise<any>
  /**
     * Logs the given message using ERROR log-level.
     *
     * @param {...args: any[]} [args] messages, metadata and errors to log.
     * @returns {Promise<any>} A promise completing when the logging-implementation processed the log statement.
     * @memberof ILoggerInstance
     */
  error: (...args: any[]) => Promise<any>
  /**
     * Gets the current log-level.
     *
     * @returns {LogLevel} The log-level.
     * @memberof ILoggerInstance
     */
  getLogLevel: () => LogLevel
  /**
     * Sets the metadata assigned to every future invocation of any of the log-methods.
     *
     * @param {*} metadata metadata object - can be undefined or null.
     * @memberof ILoggerInstance
     */
  setMetadata: (metadata: any) => void
  /**
     * Gets the underlying implementation of the logger.
     *
     * @memberof ILoggerInstance
     */
  getImplementation: () => T
}

/**
 * The standard logger instance implementation.
 *
 * @export
 * @class DefaultLoggerInstance
 * @implements {ILoggerInstance}
 */
export class DefaultLoggerInstance<T, P extends any[]> implements ILoggerInstance<T> {
  private readonly impl: LoggerImplementation<T, P>
  private readonly name: string
  private readonly group: string
  private commonMetadata: any
  private logLevel: LogLevel

  /**
     * Creates an instance of DefaultLoggerInstance.
     *
     * @param {string} name The name of the logger instance.
     * @param {string} group The group of the logger instance.
     * @param {LogLevel} logLevel The initial log-level of the logger instance.
     * @param {commonMetadata} commonMetadata The metadata added automatically to every log operation.
     * @param {LoggerImplementation} impl The underlying logger implementation.
     * @param {LoggerBuilder} builder Optional logger builder
     * @memberof DefaultLoggerInstance
     */
  public constructor (
    name: string,
    group: string,
    logLevel: LogLevel,
    commonMetadata: any,
    impl: LoggerImplementation<T, P>,
    builder?: LoggerBuilder<T, P>) {
    this.impl = impl
    this.name = name
    this.group = group
    this.logLevel = logLevel
    this.commonMetadata = commonMetadata

    const initialConfig = LoggerConfiguration.getConfig(group, name)
    this.impl.setLoggerBuilder(builder)
    this.impl.setConfig(initialConfig, group, name)
  }

  public getLogLevel (): LogLevel {
    return this.logLevel
  }

  public setLogLevel (logLevel: LogLevel): void {
    this.logLevel = logLevel
    this.impl.setLogLevel(logLevel, this.group, this.name)
  }

  public getName (): string {
    return this.name
  }

  public getGroup (): string {
    return this.group
  }

  public getImpl (): LoggerImplementation<T, P> {
    return this.impl
  }

  public getMetadata (): any {
    return this.commonMetadata
  }

  /**
     * Sets the metadata object that is gonna be assigned to every future invocation of any log method.
     *
     * @param {*} commonMetadata a metadata object - can be undefined or null.
     * @memberof DefaultLoggerInstance
     */
  public setMetadata (commonMetadata: any): void {
    this.commonMetadata = commonMetadata
    this.impl.setMetadata(commonMetadata, this.group, this.name)
  }

  public async trace (...args: any[]): Promise<any> {
    const metadata = [LogLevel.TRACE, this.group, this.name].concat(...arguments).concat(this.commonMetadata)
    return this.log.apply(this, metadata)
  }

  public async debug (...args: any[]): Promise<any> {
    const metadata = [LogLevel.DEBUG, this.group, this.name].concat(...arguments).concat(this.commonMetadata)
    return this.log.apply(this, metadata)
  }

  public async info (...args: any[]): Promise<any> {
    const metadata = [LogLevel.INFO, this.group, this.name].concat(...arguments).concat(this.commonMetadata)
    return this.log.apply(this, metadata)
  }

  public async warn (...args: any[]): Promise<any> {
    const metadata = [LogLevel.WARN, this.group, this.name].concat(...arguments).concat(this.commonMetadata)
    return this.log.apply(this, metadata)
  }

  public async error (...args: any[]): Promise<any> {
    const metadata = [LogLevel.ERROR, this.group, this.name].concat(...arguments).concat(this.commonMetadata)
    return this.log.apply(this, metadata)
  }

  public getImplementation (): T {
    return this.impl.getImplementation(this.group, this.name)
  }

  private async log (logLevel: LogLevel, ...args: any[]): Promise<any> {
    if (logLevel <= this.logLevel) {
      return this.impl.log.apply(this.impl, arguments)
    }
    await Promise.resolve()
  }
}

/**
 * Default/ Dummy logger implementation - does nothing.
 *
 * @class NullLoggerImplementation
 * @implements {LoggerImplementation}
 */
class NullLoggerImplementation implements LoggerImplementation<null, any[]> {
  public async log (...args: any[]): Promise<any> {
    return null
  }

  public getImplementation (group: string, name: string): null {
    return null
  }

  public setConfig<T>(config: T, group: string, name: string): void {
    // nothing
  }

  public setLogLevel (logLevel: LogLevel, group: string, name: string): void {
    // nothing
  }

  public setMetadata (metadata: any, group: string, name: string): void {
    // nothing
  }

  public setLoggerBuilder (builder: LoggerBuilder<null, any[]>): void {
    // nothing
  }
}

/**
 * Used to instance an cache logger instances.
 *
 * @export
 * @class LoggerFactory
 */
export class LoggerFactory {
  /**
     * Gets a logger from cache or instances a new logger instance with the given group and name.
     *
     * @static
     * @param {string} [group=""] The group of the logger instance
     * @param {string} [name=""] The name of the logger instance.
     * @returns {ILoggerInstance}
     * @memberof LoggerFactory
     */
  public static getLogger<T, P extends any[]>(
    group = '',
    name = '',
    builder?: LoggerBuilder<T, P>
  ): ILoggerInstance<T> {
    if (!LoggerFactory.INITIALIZED) {
      LoggerFactory.INITIALIZED = true
      LoggerFactory.initialize()
    }

    const compoundKey = `${group}:${name}`
    if (LoggerFactory.LOGGER_INSTANCE_CACHE.has(compoundKey)) {
      return LoggerFactory.LOGGER_INSTANCE_CACHE.get(compoundKey) as ILoggerInstance<T>
    }

    const instance = new DefaultLoggerInstance<T, P>(
      name,
      group,
      LoggerConfiguration.getLogLevel(group, name),
      LoggerFactory.COMMON_METADATA,
      LoggerFactory.LOGGER as LoggerImplementation<T, P>,
      builder)
    LoggerFactory.LOGGER_INSTANCE_CACHE.set(compoundKey, instance)
    return instance
  }

  /**
     * Clears the logger cache and conditionally resets the logger implementation.
     *
     * @static
     * @param [reinit] Causes the logger implementation to re-instantiate the logger binding if set to true.
     * @memberof LoggerFactory
     */
  public static reset (reinit = false): void {
    LoggerFactory.LOGGER_INSTANCE_CACHE.clear()
    if (reinit) {
      LoggerFactory.INITIALIZED = false
    }
  }

  /**
     * Gets the application-wide metadata object.
     *
     * @static
     * @memberof LoggerFactory
     */
  public static getMetadata (): any {
    return LoggerFactory.COMMON_METADATA
  }

  /**
     * Sets the application-wide metadata object for logger instances.
     *
     * Every new logger will get the application-wide metadata object set.
     *
     * Every logger instance that sets it's own metadata object will be excluded from
     * future updates of the application-wide metadata object.
     *
     * Note that this object is shared. Any changes to it will affect all logger instances
     * using it.
     *
     * @static
     * @param {*} metadata a metadata object - can be undefined or null.
     * @memberof LoggerFactory
     */
  public static setMetadata (metadata: any): void {
    const formerData = LoggerFactory.COMMON_METADATA
    LoggerFactory.COMMON_METADATA = metadata
    LoggerFactory.LOGGER_INSTANCE_CACHE.forEach((logger, compoundKey) => {
      if (logger.getMetadata() === formerData) {
        logger.setMetadata(LoggerFactory.COMMON_METADATA)
      }
    })
  }

  private static COMMON_METADATA: any = undefined
  private static LOGGER: LoggerImplementation<unknown, unknown[]> = new NullLoggerImplementation()
  private static ROOT_LOGGER: DefaultLoggerInstance<unknown, unknown[]>
  private static INITIALIZED: boolean = false
  private static readonly LOGGER_INSTANCE_CACHE = new Map<string, DefaultLoggerInstance<unknown, unknown[]>>()

  private static initialize<T, P extends any[]>(): void {
    const BINDINGS = new LoggerBindings().getBindings()
    const BINDING = BINDINGS[0]
    if (BINDINGS.length === 0) {
      console.log('SLF4TS: No Logger Binding found')
      return
    }
    LoggerFactory.LOGGER = BINDING.getLoggerImplementation()
    LoggerFactory.ROOT_LOGGER = LoggerFactory.getLogger() as DefaultLoggerInstance<T, P>

    if (BINDINGS.length > 1) {
      let message = 'multiple bindings found:'
      BINDINGS.forEach((binding) => {
        message += `\n  ${binding.getVendor()} - ${binding.getVersion()}`
      })
      message += `\n  using ${BINDING.getVendor()} - ${BINDING.getVersion()}`
      LoggerFactory.ROOT_LOGGER.info(message)
        .catch(console.error)
    }

    LoggerConfiguration.onLogLevelChanged(LoggerFactory.logLevelChanged)
    LoggerConfiguration.onConfigChanged(LoggerFactory.configChanged)
  }

  private static logLevelChanged (event: any): void {
    const groupEmpty = event.group === ''
    const nameEmpty = event.name === ''
    LoggerFactory.LOGGER_INSTANCE_CACHE.forEach((logger, compoundKey) => {
      const groupMatches = logger.getGroup() === event.group
      const nameMatches = logger.getName() === event.name
      if ((groupEmpty && nameEmpty) || (groupMatches && nameEmpty) || (groupMatches && nameMatches)) {
        logger.setLogLevel(event.logLevel)
      }
    })
  }

  private static configChanged (event: any): void {
    const groupEmpty = event.group === ''
    const nameEmpty = event.name === ''

    LoggerFactory.LOGGER_INSTANCE_CACHE.forEach((logger, compoundKey) => {
      const hasNameConfig = LoggerConfiguration.hasConfig(logger.getGroup(), logger.getName())
      const hasGroupConfig = LoggerConfiguration.hasConfig(logger.getGroup())
      const groupMatches = logger.getGroup() === event.group
      const nameMatches = logger.getName() === event.name

      if ((groupEmpty && nameEmpty && !hasGroupConfig && !hasNameConfig) ||
                (nameEmpty && groupMatches && !hasNameConfig) ||
                (groupMatches && nameMatches)) {
        logger.getImpl().setConfig(event.config, logger.getGroup(), logger.getName())
      }
    })
  }
}
