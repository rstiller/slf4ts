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

        if (name && group) {
            this.events.emit(`changed:log-level:${group}:${name}`, event);
        } else if (group) {
            this.events.emit(`changed:log-level:${group}`, event);
        } else {
            this.events.emit("changed:log-level", event);
        }
    }

    /**
     * Registers a new listener for configuration changes.
     *
     * @param {(...args: any[]) => void} callback The listener callback.
     * @param {string} [group=""] The group of the logger instance.
     * @param {string} [name=""] The name of the logger instance.
     * @memberof LoggerConfigurationImpl
     */
    public onLogLevelChanged(callback: (...args: any[]) => void, group = "", name = "") {
        if (name && group) {
            this.events.on(`changed:log-level:${group}:${name}`, callback);
        } else if (group) {
            this.events.on(`changed:log-level:${group}`, callback);
        } else {
            this.events.on(`changed:log-level`, callback);
        }
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
        this.defaultLogLevel = LogLevel.INFO;
    }

}

/**
 * Default configuration instance
 */
export const LoggerConfiguration = new LoggerConfigurationImpl();
