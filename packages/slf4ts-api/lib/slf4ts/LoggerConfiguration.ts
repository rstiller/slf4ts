import { EventEmitter } from "events";

export enum LogLevel {
    TRACE = 0,
    DEBUG,
    INFO,
    WARN,
    ERROR,
}

export class LoggerConfigurationImpl {

    private events: EventEmitter = new EventEmitter();
    private logLevelMapping: Map<string, LogLevel> = new Map();
    private defaultLogLevel: LogLevel = LogLevel.INFO;

    public getLogLevel(group = "", name = ""): LogLevel {
        const compoundKey = `${group}:${name}`;

        if (this.logLevelMapping.has(compoundKey)) {
            return this.logLevelMapping.get(compoundKey);
        }

        return this.defaultLogLevel;
    }

    public setDefaultLogLevel(defaultLogLevel: LogLevel) {
        this.defaultLogLevel = defaultLogLevel;
    }

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

    public onLogLevelChanged(callback: (...args: any[]) => void, group = "", name = "") {
        if (name && group) {
            this.events.on(`changed:log-level:${group}:${name}`, callback);
        } else if (group) {
            this.events.on(`changed:log-level:${group}`, callback);
        } else {
            this.events.on(`changed:log-level`, callback);
        }
    }

    public removeAllListeners() {
        this.events.removeAllListeners();
    }

    public reset() {
        this.events.removeAllListeners();
        this.logLevelMapping.clear();
        this.defaultLogLevel = LogLevel.INFO;
    }

}

export const LoggerConfiguration = new LoggerConfigurationImpl();
