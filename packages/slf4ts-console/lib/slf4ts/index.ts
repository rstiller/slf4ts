import {
    LoggerBinding,
    LoggerBindings,
    LoggerImplementation,
    LogLevel,
} from "slf4ts-api";

export class ConsoleLoggerImplementation implements LoggerImplementation {

    public async log(level: LogLevel, group: string, name: string, message: string, error: Error, metadata: any): Promise<any> {
        // tslint:disable:no-console
        const timestamp = new Date();
        let loggerName = "";

        if (group && name) {
            loggerName = `${group}.${name}`;
        } else if (group) {
            loggerName = group;
        } else if (name) {
            loggerName = name;
        } else {
            loggerName = "ROOT";
        }

        const logLevelName = `${LogLevel[level]}`;
        const logMethodName = logLevelName.toLowerCase();
        const msg = `${timestamp} [${loggerName}] ${logLevelName} - ${message}`;

        let logMethod: (...args: any[]) => void = console.log;
        if (logMethodName in console && (console as any)[logMethodName] instanceof Function) {
            logMethod = (console as any)[logMethodName];
        }

        if (error) {
            logMethod(msg, error, metadata);
        } else {
            logMethod(msg, metadata);
        }
    }

}

export class ConsoleLoggerBinding implements LoggerBinding {

    public getLoggerImplementation(): LoggerImplementation {
        return new ConsoleLoggerImplementation();
    }

    public getVendor(): string {
        return "Node.Console";
    }

    public getVersion(): string {
        return "1.0.0-beta";
    }

}

export default function(registry: LoggerBindings) {
    registry.registerBinding(new ConsoleLoggerBinding());
}
