// tslint:disable:no-unused-expression
import "source-map-support/register";

import * as chai from "chai";
import { suite, test } from "mocha-typescript";
import { LogLevel } from "slf4ts-api";
import * as td from "testdouble";

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

        expect(td.explain(consoleMock.debug).callCount).to.equal(0);
        expect(td.explain(consoleMock.error).callCount).to.equal(0);
        expect(td.explain(consoleMock.info).callCount).to.equal(0);
        expect(td.explain(consoleMock.log).callCount).to.equal(0);
        expect(td.explain(consoleMock.trace).callCount).to.equal(0);
        expect(td.explain(consoleMock.warn).callCount).to.equal(0);

        await logger.log(LogLevel.INFO, "", "", "Test Message 1", null, null);
        td.verify(consoleMock.info(td.matchers.isA(Date), "ROOT", "INFO", "Test Message 1", null), { ignoreExtraArgs: false, times: 1 });

        await logger.log(LogLevel.DEBUG, "group1", "", "Test Message 2", null, null);
        td.verify(consoleMock.debug(td.matchers.isA(Date), "group1", "DEBUG", "Test Message 2", null), { ignoreExtraArgs: false, times: 1 });

        await logger.log(LogLevel.TRACE, "", "name1", "Test Message 3", null, null);
        td.verify(consoleMock.trace(td.matchers.isA(Date), "name1", "TRACE", "Test Message 3", null), { ignoreExtraArgs: false, times: 1 });

        await logger.log(LogLevel.WARN, "group2", "name2", "Test Message 4", null, null);
        td.verify(consoleMock.warn(td.matchers.isA(Date), "group2.name2", "WARN", "Test Message 4", null), { ignoreExtraArgs: false, times: 1 });

        const metadata = { application: "my-app", version: "1.0.0" };
        await logger.log(LogLevel.ERROR, "", "", "Test Message 5", null, metadata);
        td.verify(consoleMock.error(td.matchers.isA(Date), "ROOT", "ERROR", "Test Message 5", metadata), { ignoreExtraArgs: false, times: 1 });

        const error = new Error();
        await logger.log(LogLevel.INFO, "", "", "Test Message 6", error, metadata);
        td.verify(consoleMock.info(td.matchers.isA(Date), "ROOT", "INFO", "Test Message 6", metadata, error), { ignoreExtraArgs: false, times: 1 });

        await logger.log(LogLevel.DEBUG, "", "", "Test Message 7", error, null);
        td.verify(consoleMock.debug(td.matchers.isA(Date), "ROOT", "DEBUG", "Test Message 7", null, error), { ignoreExtraArgs: false, times: 1 });

        await logger.log(6, "", "", "Test Message 8", null, null);
        td.verify(consoleMock.log(td.matchers.isA(Date), "ROOT", "", "Test Message 8", null), { ignoreExtraArgs: false, times: 1 });
    }

}
