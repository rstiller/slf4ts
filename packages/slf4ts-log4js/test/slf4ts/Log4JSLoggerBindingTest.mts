import { suite, test } from "@testdeck/mocha";
import * as chai from "chai";
import { Log4JSLoggerBinding } from "../../lib/slf4ts/Log4JSLoggerBinding";

const expect = chai.expect;

@suite
export class Log4JSLoggerBindingTest {
  @test
  public async checkLoggerBinding(): Promise<void> {
    const binding = new Log4JSLoggerBinding();

    expect(binding.getVendor()).to.equal("log4js");
    expect(binding.getVersion()).to.exist;
    expect(binding.getLoggerImplementation()).to.exist;
  }
}
