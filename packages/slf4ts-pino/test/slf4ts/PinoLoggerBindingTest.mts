import "source-map-support/register";

import { suite, test } from "@testdeck/mocha";
import * as chai from "chai";
import { PinoLoggerBinding } from "../../lib/slf4ts/PinoLoggerBinding";

const expect = chai.expect;

@suite
export class PinoLoggerBindingTest {
  @test
  public async checkLoggerBinding(): Promise<void> {
    const binding = new PinoLoggerBinding();

    expect(binding.getVendor()).to.equal("pino");
    expect(binding.getVersion()).to.exist;
    expect(binding.getLoggerImplementation()).to.exist;
  }
}
