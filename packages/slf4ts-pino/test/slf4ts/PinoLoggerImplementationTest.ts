/* eslint-env mocha */
/* eslint-disable @typescript-eslint/no-unused-expressions */

import 'source-map-support/register'

import * as chai from 'chai'
import * as pino from 'pino'
import { LoggerOptions } from 'pino'
import { merge } from 'lodash'
import { hostname } from 'os'
import { Writable } from 'stream'
import 'chai-string'
import { suite, test } from 'mocha-typescript'
import {
  LoggerConfiguration,
  LogLevel
} from 'slf4ts-api'

import { PinoLoggerImplementation } from '../../lib/slf4ts/PinoLoggerImplementation'

// eslint-disable-next-line @typescript-eslint/no-var-requires
chai.use(require('chai-string'))
const expect = chai.expect
const host = hostname()

@suite
export class PinoLoggerImplementationTest {
  @test
  public async checkLogLevel (): Promise<void> {
    const logger = new PinoLoggerImplementation()
    const calls: any[] = []

    logger.setLoggerBuilder((options: LoggerOptions) => {
      const stream = new Writable()
      stream._write = (chunk, encoding, next) => {
        calls.push([JSON.parse(chunk.toString('utf8')), encoding])
        next()
      }
      return pino(merge({}, options, {
        level: 'trace'
      }), stream)
    })

    expect(calls).to.have.length(0)

    LoggerConfiguration.setLogLevel(LogLevel.TRACE)
    await logger.log(LogLevel.TRACE, '', '', 'Test Message', {})

    expect(calls).to.have.length(1)
    expect(calls[0][0].level).to.equal(10)
    expect(calls[0][0].hostname).to.equal(host)
    expect(calls[0][0].v).to.equal(1)
    expect(calls[0][0].msg).to.equal('Test Message')

    await logger.log(LogLevel.DEBUG, '', '', 'Test Message', {})

    expect(calls).to.have.length(2)
    expect(calls[1][0].level).to.equal(20)
    expect(calls[1][0].hostname).to.equal(host)
    expect(calls[1][0].v).to.equal(1)
    expect(calls[1][0].msg).to.equal('Test Message')

    await logger.log(LogLevel.INFO, '', '', 'Test Message', {})

    expect(calls).to.have.length(3)
    expect(calls[2][0].level).to.equal(30)
    expect(calls[2][0].hostname).to.equal(host)
    expect(calls[2][0].v).to.equal(1)
    expect(calls[2][0].msg).to.equal('Test Message')

    await logger.log(LogLevel.WARN, '', '', 'Test Message', {})

    expect(calls).to.have.length(4)
    expect(calls[3][0].level).to.equal(40)
    expect(calls[3][0].hostname).to.equal(host)
    expect(calls[3][0].v).to.equal(1)
    expect(calls[3][0].msg).to.equal('Test Message')

    await logger.log(LogLevel.ERROR, '', '', 'Test Message', {})

    expect(calls).to.have.length(5)
    expect(calls[4][0].level).to.equal(50)
    expect(calls[4][0].hostname).to.equal(host)
    expect(calls[4][0].v).to.equal(1)
    expect(calls[4][0].msg).to.equal('Test Message')
  }

  @test
  public async checkArgumentPassing (): Promise<void> {
    const logger = new PinoLoggerImplementation()
    const calls: any[] = []

    logger.setLoggerBuilder((options: LoggerOptions) => {
      const stream = new Writable()
      stream._write = (chunk, encoding, next) => {
        calls.push([JSON.parse(chunk.toString('utf8')), encoding])
        next()
      }
      return pino(merge({}, options, {
        level: 'trace'
      }), stream)
    })

    expect(calls).to.have.length(0)

    await logger.log(LogLevel.INFO, '', '', 'Test Message', {})

    expect(calls).to.have.length(1)
    expect(calls[0][0].level).to.equal(30)
    expect(calls[0][0].hostname).to.equal(host)
    expect(calls[0][0].v).to.equal(1)
    expect(calls[0][0].msg).to.equal('Test Message')

    await logger.log(LogLevel.INFO, '', '', 'Test Message', { key: 'value' }, {})

    expect(calls).to.have.length(2)
    expect(calls[1][0].level).to.equal(30)
    expect(calls[1][0].hostname).to.equal(host)
    expect(calls[1][0].v).to.equal(1)
    expect(calls[1][0].msg).to.equal('Test Message {"key":"value"}')

    const error = new Error()
    await logger.log(LogLevel.INFO, '', '', 'Test Message', error, {})

    expect(calls).to.have.length(3)
    expect(calls[2][0].level).to.equal(30)
    expect(calls[2][0].hostname).to.equal(host)
    expect(calls[2][0].v).to.equal(1)
    expect(calls[2][0].msg).to.equal('Test Message')
    expect(calls[2][0].stack).to.startsWith('Error: \n')
    expect(calls[2][0].type).to.equal('Error')

    await logger.log(LogLevel.INFO, '', '', 'Test Message', error, { key: 'value' }, {})

    expect(calls).to.have.length(4)
    expect(calls[3][0].level).to.equal(30)
    expect(calls[3][0].hostname).to.equal(host)
    expect(calls[3][0].v).to.equal(1)
    expect(calls[3][0].msg).to.equal('Test Message {"key":"value"}')
    expect(calls[3][0].stack).to.startsWith('Error: \n')
    expect(calls[3][0].type).to.equal('Error')

    logger.setMetadata({
      user: 'username'
    }, '', '')

    await logger.log(LogLevel.INFO, '', '', 'Test Message', error, { key: 'value' }, {})

    expect(calls).to.have.length(5)
    expect(calls[4][0].level).to.equal(30)
    expect(calls[4][0].hostname).to.equal(host)
    expect(calls[4][0].v).to.equal(1)
    expect(calls[4][0].user).to.equal('username')
    expect(calls[4][0].msg).to.equal('Test Message {"key":"value"}')
    expect(calls[4][0].stack).to.startsWith('Error: \n')
    expect(calls[4][0].type).to.equal('Error')
  }

  @test
  public async checkArgumentPassingWithNamedLogger (): Promise<void> {
    const logger = new PinoLoggerImplementation()
    const calls: any[] = []

    logger.setLoggerBuilder((options: LoggerOptions) => {
      const stream = new Writable()
      stream._write = (chunk, encoding, next) => {
        calls.push([JSON.parse(chunk.toString('utf8')), encoding])
        next()
      }
      return pino(merge({}, options, {
        level: 'trace'
      }), stream)
    })

    expect(calls).to.have.length(0)

    const error = new Error()
    await logger.log(LogLevel.INFO, 'group', 'name', 'Test Message', error, { key: 'value' }, {})

    expect(calls).to.have.length(1)
    expect(calls[0][0].level).to.equal(30)
    expect(calls[0][0].hostname).to.equal(host)
    expect(calls[0][0].v).to.equal(1)
    expect(calls[0][0].name).to.equal('group:name')
    expect(calls[0][0].msg).to.equal('Test Message {"key":"value"}')
    expect(calls[0][0].stack).to.startsWith('Error: \n')
    expect(calls[0][0].type).to.equal('Error')

    logger.setMetadata({
      user: 'username'
    }, 'group', 'name')

    await logger.log(LogLevel.INFO, 'group', 'name', 'Test Message', error, { key: 'value' }, {})

    expect(calls).to.have.length(2)
    expect(calls[1][0].level).to.equal(30)
    expect(calls[1][0].hostname).to.equal(host)
    expect(calls[1][0].v).to.equal(1)
    expect(calls[1][0].name).to.equal('group:name')
    expect(calls[1][0].user).to.equal('username')
    expect(calls[1][0].msg).to.equal('Test Message {"key":"value"}')
    expect(calls[1][0].stack).to.startsWith('Error: \n')
    expect(calls[1][0].type).to.equal('Error')
  }
}
