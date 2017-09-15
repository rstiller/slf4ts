import "source-map-support/register";

import { ILoggerInstance, LoggerFactory } from "slf4ts-api";

export interface ElasticsearchLogConstructor {
    new (config: any): ElasticsearchLogger;
}

export class ElasticsearchLogAdapter {

    public newLogger(log?: ILoggerInstance): ElasticsearchLogConstructor {
        const effectiveLogger = log ? log : LoggerFactory.getLogger("elasticsearch");

        return (class ElasticsearchLoggerImpl extends ElasticsearchLogger {

            protected getLogger(): ILoggerInstance {
                return effectiveLogger;
            }

        });
    }

}

export abstract class ElasticsearchLogger {

    private log: ILoggerInstance;

    public constructor(config: any) {
        this.log = this.getLogger();
    }

    public error() {
        this.log.error.apply(this.log, arguments);
    }

    public warning() {
        this.log.warn.apply(this.log, arguments);
    }

    public info() {
        this.log.info.apply(this.log, arguments);
    }

    public debug() {
        this.log.debug.apply(this.log, arguments);
    }

    public trace(method: string, requestUrl: any, requestBody: any, responseBody: any, responseStatus: number) {
        this.log.trace.apply(this.log, arguments);
    }

    public close() {
    }

    protected abstract getLogger(): ILoggerInstance;

}
