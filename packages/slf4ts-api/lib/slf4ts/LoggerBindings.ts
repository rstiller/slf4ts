import 'source-map-support/register'

import * as fs from 'fs'
import * as path from 'path'

import { type LogLevel } from './LoggerConfiguration'

/**
 * Builds the instance of the underlying logger framework.
 */
export type LoggerBuilder<T, P extends any[]> = (...args: P) => T

/**
 * The bridge to the underlying logging-framework.any[]
 *
 * @export
 * @interface LoggerImplementation
 */
export interface LoggerImplementation<T, P extends any[]> {

  /**
     * Invoked for each call to a logging method of a logger instance.
     *
     * @param {...any[]} args array with log-level, group, name and all arguments passed to the logging function.
     * @returns A Promise completed when the log statement was processed by the underlying logging-framework.
     * @memberof LoggerImplementation
     */
  log: (...args: any[]) => Promise<any>

  /**
     * Gets the underlying implementation of the logger.
     *
     * @template T Type of logger instance.
     * @param {string} group The group of the logger.
     * @param {string} name The name of the logger.
     * @memberof LoggerImplementation
     */
  getImplementation: (group: string, name: string) => T

  /**
     * Sets the configuration for the specified logger instance.
     *
     * @template T Type of config object
     * @param {T} config The implementation-specific configuration.
     * @param {string} group The group of the logger.
     * @param {string} name The name of the logger.
     * @memberof LoggerImplementation
     */
  setConfig: <T>(config: T, group: string, name: string) => void

  /**
     * Informs the logger implementation of the log-level change.
     *
     * @param {LogLevel} logLevel The new log level.
     * @param {string} group The group of the logger.
     * @param {string} name The name of the logger.
     * @memberof LoggerImplementation
     */
  setLogLevel: (logLevel: LogLevel, group: string, name: string) => void

  /**
     * Informs the logger implementation of the metadata change.
     *
     * @param {any} metadata The new metadata.
     * @param {string} group The group of the logger.
     * @param {string} name The name of the logger.
     * @memberof LoggerImplementation
     */
  setMetadata: (metadata: any, group: string, name: string) => void

  /**
   * Sets the logger builder instance
   *
   * @param {LoggerBuilder<T, P>} builder
   * @memberof LoggerImplementation
   */
  setLoggerBuilder: (builder?: LoggerBuilder<T, P>) => void

}

/**
 * A metadata object for a binding.
 *
 * @export
 * @interface LoggerBinding
 */
export interface LoggerBinding<T = any, P extends any[] = any> {
  /**
     * Gets the logger implementation.
     *
     * @returns {LoggerImplementation} The logger implementation.
     * @memberof LoggerBinding
     */
  getLoggerImplementation: () => LoggerImplementation<T, P>
  /**
     * Gets the vendor string.
     *
     * @returns {string} The vendor name.
     * @memberof LoggerBinding
     */
  getVendor: () => string
  /**
     * Gets the version string.
     *
     * @returns {string} The version number.
     * @memberof LoggerBinding
     */
  getVersion: () => string
}

/**
 * Encapsulates the loading of logger bindings from NODE_PATH.
 *
 * Additionally the location of other logging-framework bindings can
 * be configured using the environment variable 'LOGGER_BINDING_ADDITIONAL_PATH'.
 *
 * For each folder - containing a file named '.slf4ts-binding' in 'NODE_PATH',
 * 'LOGGER_BINDING_ADDITIONAL_PATH' or the additional search paths given to
 * LoggerBindings - LoggerBindings loads the node-module and invokes the function
 * that is the default export of the entire module for registration.
 *
 * @export
 * @class LoggerBindings
 */
export class LoggerBindings {
  /**
     * Array of loaded bindings.
     *
     * @private
     * @type {LoggerBinding[]}
     * @memberof LoggerBindings
     */
  private readonly bindings: LoggerBinding[] = []

  /**
     * Creates an instance of LoggerBindings.
     *
     * @param {string[]} [additionalPaths=[]] A string array with additional paths to search bindings.
     * @memberof LoggerBindings
     */
  public constructor (additionalPaths: string[] = []) {
    if ('LOGGER_BINDING_ADDITIONAL_PATH' in process.env) {
      additionalPaths.push(process.env.LOGGER_BINDING_ADDITIONAL_PATH ?? '')
    }
    const mainModule = require.main ?? { paths: [], require: () => {} }
    if ('mainModule' in process && 'paths' in mainModule) {
      mainModule.paths
        .forEach((mainPath) => additionalPaths.push(mainPath))
    }

    const moduleFolders: string[] = this.getAllModuleFolders(additionalPaths)
    const loggerBindings: string[] = this.getAllLoggerBindings(moduleFolders)

    loggerBindings.forEach((binding) => {
      const registerFunc = mainModule.require(binding)
      registerFunc(this)
    })
  }

  /**
     * Used to register a logging-framework binding.
     *
     * @param {LoggerBinding} binding The LoggerBinding to register.
     * @returns
     * @memberof LoggerBindings
     */
  public registerBinding (binding: LoggerBinding): void {
    const exists = this.bindings.filter((b) => {
      const vendorEquals = b.getVendor() === binding.getVendor()
      const versionEquals = b.getVersion() === binding.getVersion()
      return vendorEquals && versionEquals
    }).length > 0

    if (exists) {
      return
    }

    this.bindings.push(binding)
  }

  /**
     * Gets a copy of all {@link LoggerBinding}
     *
     * @returns {LoggerBinding[]}
     * @memberof LoggerBindings
     */
  public getBindings (): LoggerBinding[] {
    return this.bindings.slice()
  }

  private getAllModuleFolders (additionalPaths: string[]): string[] {
    const rootPaths: string[] = (module as any).paths
    const moduleFolders: string[] = []

    rootPaths.concat(additionalPaths).forEach((rootPath) => { this.visitNodeModules(rootPath).forEach((folder) => moduleFolders.push(folder)) })

    return moduleFolders
  }

  private visitNodeModules (rootPath: string): string[] {
    const moduleFolders: string[] = []

    if (fs.existsSync(rootPath)) {
      const files = fs.readdirSync(rootPath)
      files.forEach((folder) => {
        const absolutePath = path.join(rootPath, folder)
        moduleFolders.push(absolutePath)
        this.visitNodeModules(path.join(absolutePath, 'node_modules'))
          .forEach((subfolder) => moduleFolders.push(subfolder))
      })
    }

    return moduleFolders
  }

  private getAllLoggerBindings (moduleFolders: string[]): string[] {
    const bindings: string[] = []

    moduleFolders.forEach((moduleFolder) => {
      if (fs.existsSync(path.join(moduleFolder, '.slf4ts-binding'))) {
        bindings.push(path.basename(moduleFolder))
      }
    })

    return bindings
  }
}
