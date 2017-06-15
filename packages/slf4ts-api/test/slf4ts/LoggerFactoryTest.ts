// tslint:disable:no-unused-expression
import "source-map-support/register";

import * as chai from "chai";
import { suite, test } from "mocha-typescript";

const expect = chai.expect;

@suite
export class LoggerFactoryTest {

    @test
    public check(): void {
        expect(true).to.be.true;
    }

}
