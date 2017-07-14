// tslint:disable:no-unused-expression
import "source-map-support/register";

import * as chai from "chai";
import { suite, test } from "mocha-typescript";
import { ConsoleLoggerBinding } from "../../lib/slf4ts/ConsoleLoggerBinding";

const expect = chai.expect;

@suite
export class ConsoleLoggerBindingTest {

    @test
    public async checkConsoleLoggerBinding() {
        const binding = new ConsoleLoggerBinding();

        expect(binding.getVendor()).to.equal("Node.Console");
        expect(binding.getVersion()).to.exist;
        expect(binding.getLoggerImplementation()).to.exist;
    }

}
