import { suite, test } from "@testdeck/mocha";
import * as chai from "chai";
import { BunyanLoggerBinding } from "../../lib/slf4ts/BunyanLoggerBinding";

const expect = chai.expect;

@suite
export class BunyanLoggerBindingTest {
  @test
  public async checkLoggerBinding(): Promise<void> {
    const binding = new BunyanLoggerBinding();

    expect(binding.getVendor()).to.equal("bunyan");
    expect(binding.getVersion()).to.exist;
    expect(binding.getLoggerImplementation()).to.exist;
  }
}
