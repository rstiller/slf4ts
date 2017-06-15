export type LogMethod = (message: string, ...metadata: any[]) => Promise<any>;

export interface ILoggerInstance {
    trace: LogMethod;
    debug: LogMethod;
    info: LogMethod;
    warn: LogMethod;
    error: LogMethod;
}
