// tslint:disable:no-unused-expression
import "source-map-support/register";

// import * as chai from "chai";
import { suite, test } from "mocha-typescript";
// import { LogLevel } from "slf4ts-api";
import * as td from "testdouble";

// import { WinstonLoggerImplementation } from "../../lib/slf4ts/WinstonLoggerImplementation";

// const expect = chai.expect;

@suite
export class ConsoleLoggerImplementationTest {

    public after() {
        td.reset();
    }

    @test
    public async checkArgumentPassing() {
        // const logger = new WinstonLoggerImplementation();
        // TODO:
    }

}
