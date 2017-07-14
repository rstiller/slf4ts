// tslint:disable:no-unused-expression
import "source-map-support/register";

// import * as chai from "chai";
import { suite, test } from "mocha-typescript";
import { LogLevel } from "slf4ts-api";

// const expect = chai.expect;

import { ConsoleLoggerImplementation } from "../../lib/slf4ts/index";

@suite
export class BindingTest {

    @test
    public async checkRootLogger() {
        const logger = new ConsoleLoggerImplementation();

        await logger.log(
            LogLevel.INFO,
            "",
            "",
            "Test Message",
            null,
            null,
        );
    }

}
