// tslint:disable:no-unused-expression
import "source-map-support/register";

import * as chai from "chai";
import "chai-string";
import { suite, test } from "mocha-typescript";
import { LogLevel } from "slf4ts-api";
import { configure } from "log4js";

import { Log4JSLoggerImplementation } from "../../lib/slf4ts/Log4JSLoggerImplementation";

chai.use(require("chai-string"));
const expect = chai.expect;

@suite
export class Log4JSLoggerImplementationTest {

    @test
    public async checkLogLevel() {
        const logger = new Log4JSLoggerImplementation();
        const calls: any = [];

        logger.getImplementation("test", "test")
        configure({
            appenders: {
                test: {
                    type: {
                        configure: () => (loggingEvent: any) => calls.push(loggingEvent)
                    }
                },
            },
            categories: {
                default: { appenders: [ 'test' ], level: 'TRACE' },
                'test:test': { appenders: [ 'test' ], level: 'TRACE' }
            }
        });

        expect(calls).to.have.length(0);

        await logger.log(LogLevel.TRACE, "", "", "Test Message", {});

        expect(calls).to.have.length(1);
        expect(calls[0].level.levelStr).to.equal("TRACE");
        expect(calls[0].data[0]).to.equal("Test Message");

        await logger.log(LogLevel.DEBUG, "", "", "Test Message", {});

        expect(calls).to.have.length(2);
        expect(calls[1].level.levelStr).to.equal("DEBUG");
        expect(calls[1].data[0]).to.equal("Test Message");

        await logger.log(LogLevel.INFO, "", "", "Test Message", {});

        expect(calls).to.have.length(3);
        expect(calls[2].level.levelStr).to.equal("INFO");
        expect(calls[2].data[0]).to.equal("Test Message");

        await logger.log(LogLevel.WARN, "", "", "Test Message", {});

        expect(calls).to.have.length(4);
        expect(calls[3].level.levelStr).to.equal("WARN");
        expect(calls[3].data[0]).to.equal("Test Message");

        await logger.log(LogLevel.ERROR, "", "", "Test Message", {});

        expect(calls).to.have.length(5);
        expect(calls[4].level.levelStr).to.equal("ERROR");
        expect(calls[4].data[0]).to.equal("Test Message");
    }

    @test
    public async checkArgumentPassing() {
        const logger = new Log4JSLoggerImplementation();
        const calls: any = [];

        logger.getImplementation("test", "test")
        configure({
            appenders: {
                test: {
                    type: {
                        configure: () => (loggingEvent: any) => calls.push(loggingEvent)
                    }
                },
            },
            categories: {
                default: { appenders: [ 'test' ], level: 'TRACE' },
                'test:test': { appenders: [ 'test' ], level: 'TRACE' }
            }
        });

        expect(calls).to.have.length(0);

        await logger.log(LogLevel.INFO, "", "", "Test Message", {});

        expect(calls).to.have.length(1);
        expect(calls[0].level.levelStr).to.equal("INFO");
        expect(calls[0].data[0]).to.equal("Test Message");

        await logger.log(LogLevel.INFO, "", "", "Test Message", { key: "value" }, {});

        expect(calls).to.have.length(2);
        expect(calls[1].level.levelStr).to.equal("INFO");
        expect(calls[1].data[0]).to.equal("Test Message");
        expect(calls[1].data[1].key).to.equal("value");

        const error = new Error();
        await logger.log(LogLevel.INFO, "", "", "Test Message", error, {});

        expect(calls).to.have.length(3);
        expect(calls[2].level.levelStr).to.equal("INFO");
        expect(calls[2].data[0]).to.equal("Test Message");
        expect(calls[2].data[1].stack).to.startsWith("Error: \n");

        await logger.log(LogLevel.INFO, "", "", "Test Message", error, { key: "value" }, {});

        expect(calls).to.have.length(4);
        expect(calls[3].level.levelStr).to.equal("INFO");
        expect(calls[3].data[0]).to.equal("Test Message");
        expect(calls[3].data[1].stack).to.startsWith("Error: \n");
        expect(calls[3].data[2].key).to.equal("value");
    }

}
