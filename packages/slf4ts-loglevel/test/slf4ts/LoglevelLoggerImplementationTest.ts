import "source-map-support/register";

import { suite, test } from "@testdeck/mocha";
import * as log from "loglevel";
import * as sinon from "sinon";
import { LoggerConfiguration, LogLevel } from "slf4ts-api";

import { LoglevelLoggerImplementation } from "../../lib/slf4ts/LoglevelLoggerImplementation";

@suite
export class LoglevelLoggerImplementationTest {
  private static sandbox: sinon.SinonSandbox;
  private static readonly spies: Record<string, sinon.SinonSpy> = {};

  public static async before(): Promise<void> {
    this.sandbox = sinon.createSandbox();

    for (const method of [
      "trace",
      "debug",
      "info",
      "warn",
      "error",
      "log",
    ] as const) {
      this.spies[method] = this.sandbox.spy(console, method);
    }
  }

  public static async after(): Promise<void> {
    this.sandbox.restore();
  }

  public async before(): Promise<void> {
    LoglevelLoggerImplementationTest.sandbox.resetHistory();
  }

  private get spies(): Record<string, sinon.SinonSpy> {
    return LoglevelLoggerImplementationTest.spies;
  }

  @test
  public async checkLogLevel(): Promise<void> {
    const logger = new LoglevelLoggerImplementation();

    logger.setLoggerBuilder((name: string) => {
      return log.getLogger(name);
    });

    sinon.assert.notCalled(this.spies.trace);
    sinon.assert.notCalled(this.spies.debug);
    sinon.assert.notCalled(this.spies.info);
    sinon.assert.notCalled(this.spies.warn);
    sinon.assert.notCalled(this.spies.error);
    sinon.assert.notCalled(this.spies.log);

    LoggerConfiguration.setLogLevel(LogLevel.TRACE, "group", "name");
    await logger.log(LogLevel.TRACE, "group", "name", "Test Message", {});
    sinon.assert.calledWith(this.spies.trace, "Test Message");

    await logger.log(LogLevel.DEBUG, "group", "name", "Test Message", {});
    sinon.assert.calledWith(this.spies.log, "Test Message");

    await logger.log(LogLevel.INFO, "group", "name", "Test Message", {});
    sinon.assert.calledWith(this.spies.info, "Test Message");

    await logger.log(LogLevel.WARN, "group", "name", "Test Message", {});
    sinon.assert.calledWith(this.spies.warn, "Test Message");

    await logger.log(LogLevel.ERROR, "group", "name", "Test Message", {});
    sinon.assert.calledWith(this.spies.error, "Test Message");
  }

  @test
  public async checkArgumentPassing(): Promise<void> {
    const logger = new LoglevelLoggerImplementation();

    logger.setLoggerBuilder((name: string) => {
      return log.getLogger(name);
    });

    sinon.assert.notCalled(this.spies.trace);
    sinon.assert.notCalled(this.spies.debug);
    sinon.assert.notCalled(this.spies.info);
    sinon.assert.notCalled(this.spies.warn);
    sinon.assert.notCalled(this.spies.error);
    sinon.assert.notCalled(this.spies.log);

    LoggerConfiguration.setLogLevel(LogLevel.INFO, "group", "name");
    await logger.log(LogLevel.INFO, "group", "name", "Test Message", {});
    sinon.assert.calledWith(this.spies.info, "Test Message");
    LoglevelLoggerImplementationTest.sandbox.resetHistory();

    await logger.log(
      LogLevel.INFO,
      "group",
      "name",
      "Test Message",
      { key: "value" },
      {},
    );
    sinon.assert.calledWith(this.spies.info, "Test Message", {
      key: "value",
    });
    LoglevelLoggerImplementationTest.sandbox.resetHistory();

    const error = new Error();
    await logger.log(LogLevel.INFO, "group", "name", "Test Message", error, {});
    sinon.assert.calledWith(this.spies.info, "Test Message", error);
    LoglevelLoggerImplementationTest.sandbox.resetHistory();

    await logger.log(
      LogLevel.INFO,
      "group",
      "name",
      "Test Message",
      error,
      { key: "value" },
      {},
    );
    sinon.assert.calledWith(this.spies.info, "Test Message", error, {
      key: "value",
    });
    LoglevelLoggerImplementationTest.sandbox.resetHistory();

    logger.setMetadata(
      {
        user: "username",
      },
      "group",
      "name",
    );

    await logger.log(
      LogLevel.INFO,
      "group",
      "name",
      "Test Message",
      error,
      { key: "value" },
      {},
    );
    sinon.assert.calledWith(
      this.spies.info,
      "Test Message",
      error,
      { key: "value" },
      {},
    );
  }
}
