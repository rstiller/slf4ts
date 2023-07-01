/* eslint-env mocha */
/* eslint-disable @typescript-eslint/no-unused-expressions */

import 'source-map-support/register'

import * as chai from 'chai'
import * as log from 'loglevel'
import * as sinon from 'sinon'
import * as sinonChai from 'sinon-chai'
import { suite, test } from '@testdeck/mocha'
import {
  LoggerConfiguration,
  LogLevel
} from 'slf4ts-api'

import { LoglevelLoggerImplementation } from '../../lib/slf4ts/LoglevelLoggerImplementation'

chai.use(sinonChai)
const expect = chai.expect

@suite
export class LoglevelLoggerImplementationTest {
  private static sandbox: sinon.SinonSandbox
  public static async before (): Promise<void> {
    this.sandbox = sinon.createSandbox()

    this.sandbox.spy(console, 'trace')
    this.sandbox.spy(console, 'debug')
    this.sandbox.spy(console, 'info')
    this.sandbox.spy(console, 'warn')
    this.sandbox.spy(console, 'error')
    this.sandbox.spy(console, 'log')
  }

  public static async after (): Promise<void> {
    this.sandbox.restore()
  }

  public async before (): Promise<void> {
    LoglevelLoggerImplementationTest.sandbox.resetHistory()
  }

  @test
  public async checkLogLevel (): Promise<void> {
    const logger = new LoglevelLoggerImplementation()

    logger.setLoggerBuilder((name: string) => {
      return log.getLogger(name)
    })

    expect(console.trace).to.not.have.been.called
    expect(console.debug).to.not.have.been.called
    expect(console.info).to.not.have.been.called
    expect(console.warn).to.not.have.been.called
    expect(console.error).to.not.have.been.called
    expect(console.log).to.not.have.been.called

    LoggerConfiguration.setLogLevel(LogLevel.TRACE, 'group', 'name')
    await logger.log(LogLevel.TRACE, 'group', 'name', 'Test Message', {})
    expect(console.trace).to.have.been.calledWith('Test Message')

    await logger.log(LogLevel.DEBUG, 'group', 'name', 'Test Message', {})
    expect(console.log).to.have.been.calledWith('Test Message')

    await logger.log(LogLevel.INFO, 'group', 'name', 'Test Message', {})
    expect(console.info).to.have.been.calledWith('Test Message')

    await logger.log(LogLevel.WARN, 'group', 'name', 'Test Message', {})
    expect(console.warn).to.have.been.calledWith('Test Message')

    await logger.log(LogLevel.ERROR, 'group', 'name', 'Test Message', {})
    expect(console.error).to.have.been.calledWith('Test Message')
  }

  @test
  public async checkArgumentPassing (): Promise<void> {
    const logger = new LoglevelLoggerImplementation()

    logger.setLoggerBuilder((name: string) => {
      return log.getLogger(name)
    })

    expect(console.trace).to.not.have.been.called
    expect(console.debug).to.not.have.been.called
    expect(console.info).to.not.have.been.called
    expect(console.warn).to.not.have.been.called
    expect(console.error).to.not.have.been.called
    expect(console.log).to.not.have.been.called

    LoggerConfiguration.setLogLevel(LogLevel.INFO, 'group', 'name')
    await logger.log(LogLevel.INFO, 'group', 'name', 'Test Message', {})
    expect(console.info).to.have.been.calledWith('Test Message')
    LoglevelLoggerImplementationTest.sandbox.resetHistory()

    await logger.log(LogLevel.INFO, 'group', 'name', 'Test Message', { key: 'value' }, {})
    expect(console.info).to.have.been.calledWith('Test Message', { key: 'value' })
    LoglevelLoggerImplementationTest.sandbox.resetHistory()

    const error = new Error()
    await logger.log(LogLevel.INFO, 'group', 'name', 'Test Message', error, {})
    expect(console.info).to.have.been.calledWith('Test Message', error)
    LoglevelLoggerImplementationTest.sandbox.resetHistory()

    await logger.log(LogLevel.INFO, 'group', 'name', 'Test Message', error, { key: 'value' }, {})
    expect(console.info).to.have.been.calledWith('Test Message', error, { key: 'value' })
    LoglevelLoggerImplementationTest.sandbox.resetHistory()

    logger.setMetadata({
      user: 'username'
    }, 'group', 'name')

    await logger.log(LogLevel.INFO, 'group', 'name', 'Test Message', error, { key: 'value' }, {})
    expect(console.info).to.have.been.calledWith('Test Message', error, { key: 'value' }, {})
  }
}
