import 'source-map-support/register'

import { EventEmitter } from 'events'

/**
 * LogLevel enumeration.
 *
 * @export
 * @enum {number}
 */
export enum LogLevel {
  ERROR = 0,
  WARN,
  INFO,
  DEBUG,
  TRACE,
}

/**
 *
 *
 * @export
 * @class LoggerConfigurationImpl
 */
export class LoggerConfigurationImpl {
  private readonly events: EventEmitter = new EventEmitter();
  private readonly logLevelMapping: Map<string, LogLevel> = new Map();
  private readonly configMapping: Map<string, any> = new Map();
  private defaultLogLevel: LogLevel = LogLevel.INFO;

  /**
     * Gets the log-level for the given group and name.
     *
     * If no log-level is found for the given group and name the default log-level is returned.
     *
     * @param {string} [group=""] The group of the logger.
     * @param {string} [name=""] The name of the logger.
     * @returns {LogLevel} the log-level for the logger.
     * @memberof LoggerConfigurationImpl
     */
  public getLogLevel (group = '', name = ''): LogLevel {
    const compoundKey = `${group}:${name}`

    if (this.logLevelMapping.has(compoundKey)) {
      return this.logLevelMapping.get(compoundKey)
    }

    return this.defaultLogLevel
  }

  /**
     * Sets the default log-level.
     *
     * @param {LogLevel} defaultLogLevel
     * @memberof LoggerConfigurationImpl
     */
  public setDefaultLogLevel (defaultLogLevel: LogLevel): LoggerConfigurationImpl {
    this.defaultLogLevel = defaultLogLevel
    return this
  }

  /**
     * Set the log-level for the given group and name.
     *
     * @param {LogLevel} logLevel The new log-level.
     * @param {string} [group=""] The group of the logger instance.
     * @param {string} [name=""] The name of the logger instance.
     * @memberof LoggerConfigurationImpl
     */
  public setLogLevel (logLevel: LogLevel, group = '', name = ''): LoggerConfigurationImpl {
    const event = { group, logLevel, name }
    const compoundKey = `${group}:${name}`

    this.logLevelMapping.set(compoundKey, logLevel)
    this.events.emit('changed:log-level', event)

    return this
  }

  /**
     * Set the implementation-specific config for the given group and name.
     *
     * @template T Type of config.
     * @param {T} config The implementation-specific config for the specified logger.
     * @param {string} [group=""] The group of the logger instance.
     * @param {string} [name=""] The name of the logger instance.
     * @memberof LoggerConfigurationImpl
     */
  public setConfig<T>(config: T, group = '', name = ''): LoggerConfigurationImpl {
    const event = { group, config, name }
    const compoundKey = `${group}:${name}`

    this.configMapping.set(compoundKey, config)
    this.events.emit('changed:config', event)

    return this
  }

  /**
     * Set the implementation-specific config for the given group and name.
     *
     * @template T Type of config.
     * @param {T} config The implementation-specific config for the specified logger.
     * @param {string} [group=""] The group of the logger instance.
     * @param {string} [name=""] The name of the logger instance.
     * @memberof LoggerConfigurationImpl
     */
  public getConfig<T>(group = '', name = ''): T {
    /* eslint-disable @typescript-eslint/strict-boolean-expressions */
    return this.configMapping.get(`${group}:${name}`) ||
           this.configMapping.get(`${group}:`) ||
           this.configMapping.get(':')
    /* eslint-disable @typescript-eslint/strict-boolean-expressions */
  }

  /**
     * Registers a new listener for log-level changes.
     *
     * @param {(...args: any[]) => void} callback The listener callback.
     * @param {string} [group=""] (Deprecated - Ignored and will be removed) The group of the logger instance.
     * @param {string} [name=""] (Deprecated - Ignored and will be removed) The name of the logger instance.
     * @memberof LoggerConfigurationImpl
     */
  public onLogLevelChanged (callback: (...args: any[]) => void, group = '', name = ''): LoggerConfigurationImpl {
    this.events.on('changed:log-level', callback)
    return this
  }

  /**
     * Registers a new listener for configuration changes.
     *
     * @param {(...args: any[]) => void} callback The listener callback.
     * @param {string} [group=""] (Deprecated - Ignored and will be removed) The group of the logger instance.
     * @param {string} [name=""] (Deprecated - Ignored and will be removed) The name of the logger instance.
     * @memberof LoggerConfigurationImpl
     */
  public onConfigChanged (callback: (...args: any[]) => void, group = '', name = ''): LoggerConfigurationImpl {
    this.events.on('changed:config', callback)
    return this
  }

  /**
     * Removes all listeners.
     *
     * @memberof LoggerConfigurationImpl
     */
  public removeAllListeners (): LoggerConfigurationImpl {
    this.events.removeAllListeners()
    return this
  }

  /**
     * Removes all listeners, clears all log-level configurations and sets the default-log-level to INFO.
     *
     * @memberof LoggerConfigurationImpl
     */
  public reset (): LoggerConfigurationImpl {
    this.events.removeAllListeners()
    this.logLevelMapping.clear()
    this.configMapping.clear()
    this.defaultLogLevel = LogLevel.INFO
    return this
  }

  /**
     * Checks if the config for a certain logger is present.
     *
     * @param {string} [group=""] The group of the logger instance.
     * @param {string} [name=""] The name of the logger instance.
     * @memberof LoggerConfigurationImpl
     */
  public hasConfig (group = '', name = ''): boolean {
    const compoundKey = `${group}:${name}`
    return this.configMapping.has(compoundKey)
  }
}

/**
 * Default configuration instance
 */
export const LoggerConfiguration = new LoggerConfigurationImpl()
