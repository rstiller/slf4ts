// tslint:disable:no-unused-expression
import "source-map-support/register";

import * as chai from "chai";
import "chai-string";
import { suite, test } from "mocha-typescript";
import { LogLevel } from "slf4ts-api";
import * as TransportStream from "winston-transport";
import { TransportStreamOptions } from "winston-transport";

import { WinstonLoggerImplementation } from "../../lib/slf4ts/WinstonLoggerImplementation";

chai.use(require("chai-string"));
const expect = chai.expect;

class TestTransport extends TransportStream {
    public constructor(options: TransportStreamOptions) {
        super(options);
    }
}

@suite
export class WinstonLoggerImplementationTest {

    @test
    public async checkLogLevel() {
        const logger = new WinstonLoggerImplementation();
        const calls: any = [];

        logger.getImplementation("", "").configure({
            level: "silly",
            // tslint:disable-next-line:object-literal-shorthand
            transports: [new TestTransport({
                log(message: any, callback: (...args: any[]) => void) {
                    calls.push(arguments);
                    callback(null, true);
                },
            })],
        });

        expect(calls).to.have.length(0);

        await logger.log(LogLevel.TRACE, "", "", "Test Message");

        expect(calls).to.have.length(1);
        expect(calls[0][0].level).to.equal("silly");
        expect(calls[0][0].message).to.equal("Test Message");

        await logger.log(LogLevel.DEBUG, "", "", "Test Message");

        expect(calls).to.have.length(2);
        expect(calls[1][0].level).to.equal("debug");
        expect(calls[1][0].message).to.equal("Test Message");

        await logger.log(LogLevel.INFO, "", "", "Test Message");

        expect(calls).to.have.length(3);
        expect(calls[2][0].level).to.equal("info");
        expect(calls[2][0].message).to.equal("Test Message");

        await logger.log(LogLevel.WARN, "", "", "Test Message");

        expect(calls).to.have.length(4);
        expect(calls[3][0].level).to.equal("warn");
        expect(calls[3][0].message).to.equal("Test Message");

        await logger.log(LogLevel.ERROR, "", "", "Test Message");

        expect(calls).to.have.length(5);
        expect(calls[4][0].level).to.equal("error");
        expect(calls[4][0].message).to.equal("Test Message");
    }

    @test
    public async checkArgumentPassing() {
        const logger = new WinstonLoggerImplementation();
        const calls: any = [];

        logger.getImplementation("", "").configure({
            level: "silly",
            // tslint:disable-next-line:object-literal-shorthand
            transports: [new TestTransport({
                log(message: any, callback: (...args: any[]) => void) {
                    calls.push(arguments);
                    callback(null, true);
                },
            })],
        });

        expect(calls).to.have.length(0);

        await logger.log(LogLevel.INFO, "", "", "Test Message");

        expect(calls).to.have.length(1);
        expect(calls[0][0].level).to.equal("info");
        expect(calls[0][0].message).to.equal("Test Message");

        await logger.log(LogLevel.INFO, "", "", "Test Message", { key: "value" });

        expect(calls).to.have.length(2);
        expect(calls[1][0].level).to.equal("info");
        expect(calls[1][0].message).to.equal("Test Message");
        expect(calls[1][0].key).to.equal("value");

        const error = new Error();
        await logger.log(LogLevel.INFO, "", "", "Test Message", error);

        expect(calls).to.have.length(3);
        expect(calls[2][0].level).to.equal("info");
        expect(calls[2][0].message).to.startsWith("Test Message");
        expect(calls[2][0].stack).to.startsWith("Error\n");

        await logger.log(LogLevel.INFO, "", "", "Test Message", error, { key: "value" });

        expect(calls).to.have.length(4);
        expect(calls[3][0].level).to.equal("info");
        expect(calls[3][0].message).to.startsWith("Test Message");
        expect(calls[3][0].key).to.equal("value");
        expect(calls[3][0].stack).to.startsWith("Error\n");
    }

}
