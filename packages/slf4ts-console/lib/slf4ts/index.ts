import {
    LoggerBinding,
    LoggerBindings,
    LoggerImplementation,
    LogLevel,
} from "slf4ts-api";

class ConsoleLoggerImplementation implements LoggerImplementation {

    public async log(level: LogLevel, group: string, name: string, message: string, error: Error, metadata: any): Promise<any> {
        throw new Error("Method not implemented.");
    }

}

class ConsoleLoggerBinding implements LoggerBinding {

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
