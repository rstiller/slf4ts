// tslint:disable:no-unused-expression
import "source-map-support/register";

import * as chai from "chai";
import { suite, test } from "mocha-typescript";
import { WinstonLoggerBinding } from "../../lib/slf4ts/WinstonLoggerBinding";

const expect = chai.expect;

@suite
export class WinstonLoggerBindingTest {

    @test
    public async checkLoggerBinding() {
        const binding = new WinstonLoggerBinding();

        expect(binding.getVendor()).to.equal("Winston");
        expect(binding.getVersion()).to.exist;
        expect(binding.getLoggerImplementation()).to.exist;
    }

}
