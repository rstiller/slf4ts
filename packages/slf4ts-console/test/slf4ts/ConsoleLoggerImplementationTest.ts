// tslint:disable:no-unused-expression
import "source-map-support/register";

import * as chai from "chai";
import { suite, test } from "mocha-typescript";
import { LogLevel } from "slf4ts-api";
import * as td from "testdouble";
import * as util from "util";

import { ConsoleLoggerImplementation } from "../../lib/slf4ts/ConsoleLoggerImplementation";

const expect = chai.expect;

@suite
export class ConsoleLoggerImplementationTest {

    public after() {
        td.reset();
    }

    @test
    public async checkArgumentPassing() {
        const consoleMock = td.object(console);
        const logger = new ConsoleLoggerImplementation(consoleMock);

        expect(td.explain(consoleMock.error).callCount).to.equal(0);
        expect(td.explain(consoleMock.info).callCount).to.equal(0);
        expect(td.explain(consoleMock.log).callCount).to.equal(0);
        expect(td.explain(consoleMock.trace).callCount).to.equal(0);
        expect(td.explain(consoleMock.warn).callCount).to.equal(0);

        await logger.log(LogLevel.INFO, "", "", "Test Message 1", null, null);
        td.verify(consoleMock.info(td.matchers.isA(String), "ROOT", "INFO", "Test Message 1"), { ignoreExtraArgs: false, times: 1 });

        await logger.log(LogLevel.DEBUG, "group1", "", "Test Message 2", null, null);
        td.verify(consoleMock.log(td.matchers.isA(String), "group1", "DEBUG", "Test Message 2"), { ignoreExtraArgs: false, times: 1 });

        await logger.log(LogLevel.TRACE, "", "name1", "Test Message 3", null, null);
        td.verify(consoleMock.trace(td.matchers.isA(String), "name1", "TRACE", "Test Message 3"), { ignoreExtraArgs: false, times: 1 });

        await logger.log(LogLevel.WARN, "group2", "name2", "Test Message 4", null, null);
        td.verify(consoleMock.warn(td.matchers.isA(String), "group2.name2", "WARN", "Test Message 4"), { ignoreExtraArgs: false, times: 1 });

        const metadata = { application: "my-app", version: "1.0.0" };
        await logger.log(LogLevel.ERROR, "", "", "Test Message 5", null, metadata);
        td.verify(consoleMock.error(td.matchers.isA(String), "ROOT", "ERROR", "Test Message 5", util.inspect(metadata)), { ignoreExtraArgs: false, times: 1 });

        const error = new Error();
        await logger.log(LogLevel.INFO, "", "", "Test Message 6", error, metadata);
        td.verify(consoleMock.info(td.matchers.isA(String), "ROOT", "INFO", "Test Message 6", util.inspect(metadata), error), { ignoreExtraArgs: false, times: 1 });

        await logger.log(LogLevel.DEBUG, "", "", "Test Message 7", error, null);
        td.verify(consoleMock.log(td.matchers.isA(String), "ROOT", "DEBUG", "Test Message 7", error), { ignoreExtraArgs: false, times: 1 });

        await logger.log(6, "", "", "Test Message 8", null, null);
        td.verify(consoleMock.log(td.matchers.isA(String), "ROOT", "", "Test Message 8"), { ignoreExtraArgs: false, times: 1 });
    }

}
