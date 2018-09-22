import "source-map-support/register";

import { EventEmitter } from "events";

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

export class LoggerConfigurationImpl {

    private events: EventEmitter = new EventEmitter();
    private logLevelMapping: Map<string, LogLevel> = new Map();
    private configMapping: Map<string, any> = new Map();
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
    public getLogLevel(group = "", name = ""): LogLevel {
        const compoundKey = `${group}:${name}`;

        if (this.logLevelMapping.has(compoundKey)) {
            return this.logLevelMapping.get(compoundKey);
        }

        return this.defaultLogLevel;
    }

    /**
     * Sets the default log-level.
     *
     * @param {LogLevel} defaultLogLevel
     * @memberof LoggerConfigurationImpl
     */
    public setDefaultLogLevel(defaultLogLevel: LogLevel) {
        this.defaultLogLevel = defaultLogLevel;
    }

    /**
     * Set the log-level for the given group and name.
     *
     * @param {LogLevel} logLevel The new log-level.
     * @param {string} [group=""] The group of the logger instance.
     * @param {string} [name=""] The name of the logger instance.
     * @memberof LoggerConfigurationImpl
     */
    public setLogLevel(logLevel: LogLevel, group = "", name = "") {
        const event = { group, logLevel, name };
        const compoundKey = `${group}:${name}`;

        this.logLevelMapping.set(compoundKey, logLevel);
        this.events.emit("changed:log-level", event);
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
    public setConfig<T>(config: T, group = "", name = "") {
        const event = { group, config, name };
        const compoundKey = `${group}:${name}`;

        this.configMapping.set(compoundKey, config);
        this.events.emit(`changed:config`, event);
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
    public getConfig<T>(group = "", name = ""): T {
        return  this.configMapping.get(`${group}:${name}`) ||
                this.configMapping.get(`${group}:`) || this.configMapping.get(":");
    }

    /**
     * Registers a new listener for log-level changes.
     *
     * @param {(...args: any[]) => void} callback The listener callback.
     * @param {string} [group=""] (Deprecated - Ignored and will be removed) The group of the logger instance.
     * @param {string} [name=""] (Deprecated - Ignored and will be removed) The name of the logger instance.
     * @memberof LoggerConfigurationImpl
     */
    public onLogLevelChanged(callback: (...args: any[]) => void, group = "", name = "") {
        this.events.on(`changed:log-level`, callback);
    }

    /**
     * Registers a new listener for configuration changes.
     *
     * @param {(...args: any[]) => void} callback The listener callback.
     * @param {string} [group=""] (Deprecated - Ignored and will be removed) The group of the logger instance.
     * @param {string} [name=""] (Deprecated - Ignored and will be removed) The name of the logger instance.
     * @memberof LoggerConfigurationImpl
     */
    public onConfigChanged(callback: (...args: any[]) => void, group = "", name = "") {
        this.events.on(`changed:config`, callback);
    }

    /**
     * Removes all listeners.
     *
     * @memberof LoggerConfigurationImpl
     */
    public removeAllListeners() {
        this.events.removeAllListeners();
    }

    /**
     * Removes all listeners, clears all log-level configurations and sets the default-log-level to INFO.
     *
     * @memberof LoggerConfigurationImpl
     */
    public reset() {
        this.events.removeAllListeners();
        this.logLevelMapping.clear();
        this.configMapping.clear();
        this.defaultLogLevel = LogLevel.INFO;
    }

    /**
     * Checks if the config for a certain logger is present.
     *
     * @param {string} [group=""] The group of the logger instance.
     * @param {string} [name=""] The name of the logger instance.
     * @memberof LoggerConfigurationImpl
     */
    public hasConfig(group = "", name = ""): boolean {
        const compoundKey = `${group}:${name}`;
        return this.configMapping.has(compoundKey);
    }

}

/**
 * Default configuration instance
 */
export const LoggerConfiguration = new LoggerConfigurationImpl();
