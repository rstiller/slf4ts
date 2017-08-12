import "source-map-support/register";

import { LoggerBindings, LoggerImplementation } from "./LoggerBindings";
import { LoggerConfiguration, LogLevel } from "./LoggerConfiguration";

const BINDINGS = new LoggerBindings().getBindings();
const BINDING = BINDINGS[0];

/**
 * Interface representing a logger instance.
 *
 * @export
 * @interface ILoggerInstance
 */
export interface ILoggerInstance {
    /**
     * Logs the given message using TRACE log-level.
     *
     * @param {string} message The message to be logged.
     * @param {(any | Error)} [metadata] Either an Error instance or a metadata object - can be undefined or null.
     * @param {Error} [error] Optional Error instance to log.
     * @returns {Promise<any>} A promise completing when the logging-implementation processed the log statement.
     * @memberof ILoggerInstance
     */
    trace(message: string, metadata?: any | Error, error?: Error): Promise<any>;
    /**
     * Logs the given message using DEBUG log-level.
     *
     * @param {string} message The message to be logged.
     * @param {(any | Error)} [metadata] Either an Error instance or a metadata object - can be undefined or null.
     * @param {Error} [error] Optional Error instance to log.
     * @returns {Promise<any>} A promise completing when the logging-implementation processed the log statement.
     * @memberof ILoggerInstance
     */
    debug(message: string, metadata?: any | Error, error?: Error): Promise<any>;
    /**
     * Logs the given message using INFO log-level.
     *
     * @param {string} message The message to be logged.
     * @param {(any | Error)} [metadata] Either an Error instance or a metadata object - can be undefined or null.
     * @param {Error} [error] Optional Error instance to log.
     * @returns {Promise<any>} A promise completing when the logging-implementation processed the log statement.
     * @memberof ILoggerInstance
     */
    info(message: string, metadata?: any | Error, error?: Error): Promise<any>;
    /**
     * Logs the given message using WARN log-level.
     *
     * @param {string} message The message to be logged.
     * @param {(any | Error)} [metadata] Either an Error instance or a metadata object - can be undefined or null.
     * @param {Error} [error] Optional Error instance to log.
     * @returns {Promise<any>} A promise completing when the logging-implementation processed the log statement.
     * @memberof ILoggerInstance
     */
    warn(message: string, metadata?: any | Error, error?: Error): Promise<any>;
    /**
     * Logs the given message using ERROR log-level.
     *
     * @param {string} message The message to be logged.
     * @param {(any | Error)} [metadata] Either an Error instance or a metadata object - can be undefined or null.
     * @param {Error} [error] Optional Error instance to log.
     * @returns {Promise<any>} A promise completing when the logging-implementation processed the log statement.
     * @memberof ILoggerInstance
     */
    error(message: string, metadata?: any | Error, error?: Error): Promise<any>;
    /**
     * Gets the current log-level.
     *
     * @returns {LogLevel} The log-level.
     * @memberof ILoggerInstance
     */
    getLogLevel(): LogLevel;
    /**
     * Sets the metadata assigned to every future invocation of any of the log-methods.
     *
     * @param {*} metadata metadata object - can be undefined or null.
     * @memberof ILoggerInstance
     */
    setMetadata(metadata: any): void;
    /**
     * Gets the underlying implementation of the logger.
     *
     * @memberof ILoggerInstance
     */
    getImplementation<T>(): T;
}

/**
 * The standard logger instance implementation.
 *
 * @export
 * @class DefaultLoggerInstance
 * @implements {ILoggerInstance}
 */
export class DefaultLoggerInstance implements ILoggerInstance {

    private impl: LoggerImplementation;
    private name: string;
    private group: string;
    private commonMetadata: any;
    private logLevel: LogLevel;

    /**
     * Creates an instance of DefaultLoggerInstance.
     *
     * @param {string} name The name of the logger instance.
     * @param {string} group The group of the logger instance.
     * @param {LogLevel} logLevel The initial log-level of the logger instance.
     * @param {LoggerImplementation} impl The underlying logger implementation.
     * @memberof DefaultLoggerInstance
     */
    public constructor(name: string, group: string, logLevel: LogLevel, impl: LoggerImplementation) {
        this.impl = impl;
        this.name = name;
        this.group = group;
        this.logLevel = logLevel;

        const initialConfig = LoggerConfiguration.getConfig(group, name);
        this.impl.setConfig(initialConfig, group, name);
    }

    public getLogLevel(): LogLevel {
        return this.logLevel;
    }

    public setLogLevel(logLevel: LogLevel): void {
        this.logLevel = logLevel;
    }

    public getName(): string {
        return this.name;
    }

    public getGroup(): string {
        return this.group;
    }

    public getImpl(): LoggerImplementation {
        return this.impl;
    }

    /**
     * Sets the metadata object that is gonna be assigned to every future invocation of any log method.
     *
     * @param {*} commonMetadata a metadata object - can be undefined or null.
     * @memberof DefaultLoggerInstance
     */
    public setMetadata(commonMetadata: any): void {
        this.commonMetadata = commonMetadata;
    }

    public async trace(message: string, metadata?: any, error?: Error): Promise<any> {
        return this.log(LogLevel.TRACE, message, metadata, error);
    }

    public async debug(message: string, metadata?: any, error?: Error): Promise<any> {
        return this.log(LogLevel.DEBUG, message, metadata, error);
    }

    public async info(message: string, metadata?: any, error?: Error): Promise<any> {
        return this.log(LogLevel.INFO, message, metadata, error);
    }

    public async warn(message: string, metadata?: any, error?: Error): Promise<any> {
        return this.log(LogLevel.WARN, message, metadata, error);
    }

    public async error(message: string, metadata?: any, error?: Error): Promise<any> {
        return this.log(LogLevel.ERROR, message, metadata, error);
    }

    public getImplementation<T>(): T {
        return this.impl.getImplementation<T>(this.group, this.name);
    }

    private async log(logLevel: LogLevel, message: string, metadata: any, error: Error): Promise<any> {
        if (logLevel <= this.logLevel) {
            if (metadata instanceof Error) {
                return this.impl.log(logLevel, this.group, this.name, message, metadata, this.commonMetadata);
            } else {
                let metadataObject;
                if ((metadata && Object.keys(metadata).length > 0) ||
                    (this.commonMetadata && Object.keys(this.commonMetadata).length > 0)) {
                    metadataObject = { ...this.commonMetadata, ...metadata };
                }
                return this.impl.log(logLevel, this.group, this.name, message, error, metadataObject);
            }
        }
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
    public static getLogger(group = "", name = ""): ILoggerInstance {
        if (!LoggerFactory.INITIALIZED) {
            LoggerFactory.INITIALIZED = true;
            LoggerFactory.initialize();
        }

        const compoundKey = `${group}:${name}`;
        if (LoggerFactory.LOGGER_INSTANCE_CACHE.has(compoundKey)) {
            return LoggerFactory.LOGGER_INSTANCE_CACHE.get(compoundKey);
        }

        const instance = new DefaultLoggerInstance(name, group, LoggerConfiguration.getLogLevel(group, name), LoggerFactory.LOGGER);
        LoggerFactory.LOGGER_INSTANCE_CACHE.set(compoundKey, instance);
        return instance;
    }

    /**
     * Clears the logger cache and conditionally resets the logger implementation.
     *
     * @static
     * @param {boolean} [resetLoggerImplementation=false] Causes the logger implementation to reinstanciate the logger binding if set to true.
     * @memberof LoggerFactory
     */
    public static reset(resetLoggerImplementation = false) {
        LoggerFactory.LOGGER_INSTANCE_CACHE.clear();
        if (resetLoggerImplementation) {
            LoggerFactory.INITIALIZED = false;
        }
    }

    private static LOGGER: LoggerImplementation;
    private static ROOT_LOGGER: DefaultLoggerInstance;
    private static INITIALIZED: boolean = false;
    private static LOGGER_INSTANCE_CACHE: Map<string, DefaultLoggerInstance> = new Map();

    private static initialize() {
        if (!BINDING) {
            throw new Error("No Logger Binding found");
        }
        LoggerFactory.LOGGER = BINDING.getLoggerImplementation();
        LoggerFactory.ROOT_LOGGER = LoggerFactory.getLogger() as DefaultLoggerInstance;

        if (BINDINGS.length > 1) {
            let message = "multiple bindings found:";
            BINDINGS.forEach((binding) => message += `\n  ${binding.getVendor()} - ${binding.getVersion()}`);
            message += `\n  using ${BINDING.getVendor()} - ${BINDING.getVersion()}`;
            LoggerFactory.ROOT_LOGGER.info(message);
        }

        LoggerConfiguration.onLogLevelChanged(LoggerFactory.logLevelChanged);
        LoggerConfiguration.onConfigChanged(LoggerFactory.configChanged);
    }

    private static logLevelChanged(event: any) {
        const groupEmpty = "" === event.group;
        const nameEmpty = "" === event.name;
        LoggerFactory.LOGGER_INSTANCE_CACHE.forEach((logger, compoundKey) => {
            const groupMatches = logger.getGroup() === event.group;
            const nameMatches = logger.getName() === event.name;
            if ((groupEmpty && nameEmpty) || (groupMatches && nameEmpty) || (groupMatches && nameMatches)) {
                logger.setLogLevel(event.logLevel);
            }
        });
    }

    private static configChanged(event: any) {
        const groupEmpty = "" === event.group;
        const nameEmpty = "" === event.name;

        LoggerFactory.LOGGER_INSTANCE_CACHE.forEach((logger, compoundKey) => {
            const hasNameConfig = LoggerConfiguration.hasConfig(logger.getGroup(), logger.getName());
            const hasGroupConfig = LoggerConfiguration.hasConfig(logger.getGroup());
            const groupMatches = logger.getGroup() === event.group;
            const nameMatches = logger.getName() === event.name;

            if ((groupEmpty && nameEmpty && !hasGroupConfig && !hasNameConfig) ||
                (nameEmpty && groupMatches && !hasNameConfig) ||
                (groupMatches && nameMatches)) {
                logger.getImpl().setConfig(event.config, logger.getGroup(), logger.getName());
            }
        });
    }

}
