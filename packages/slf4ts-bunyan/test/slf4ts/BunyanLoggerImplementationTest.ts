/* eslint-env mocha */
/* eslint-disable @typescript-eslint/no-unused-expressions */

import 'source-map-support/register'

import * as chai from 'chai'
import * as Logger from 'bunyan'
import { merge } from 'lodash'
import { hostname } from 'os'
import 'chai-string'
import { suite, test } from '@testdeck/mocha'
import {
  LoggerConfiguration,
  LogLevel
} from 'slf4ts-api'

import { BunyanLoggerImplementation } from '../../lib/slf4ts/BunyanLoggerImplementation'

// eslint-disable-next-line @typescript-eslint/no-var-requires
chai.use(require('chai-string'))
const expect = chai.expect
const host = hostname()

@suite
export class BunyanLoggerImplementationTest {
  @test
  public async checkLogLevel (): Promise<void> {
    const logger = new BunyanLoggerImplementation()
    const ringBuffer = new Logger.RingBuffer({ limit: 100 })

    logger.setLoggerBuilder((options: Logger.LoggerOptions) => {
      return Logger.createLogger(merge({}, options, {
        streams: [{
          type: 'raw',
          stream: ringBuffer,
          level: Logger.TRACE
        }]
      }))
    })

    expect(ringBuffer.records).to.have.length(0)

    LoggerConfiguration.setLogLevel(LogLevel.TRACE)
    await logger.log(LogLevel.TRACE, '', '', 'Test Message', {})

    expect(ringBuffer.records).to.have.length(1)
    expect(ringBuffer.records[0].level).to.equal(10)
    expect(ringBuffer.records[0].hostname).to.equal(host)
    expect(ringBuffer.records[0].v).to.equal(0)
    expect(ringBuffer.records[0].msg).to.equal('Test Message')

    await logger.log(LogLevel.DEBUG, '', '', 'Test Message', {})

    expect(ringBuffer.records).to.have.length(2)
    expect(ringBuffer.records[1].level).to.equal(20)
    expect(ringBuffer.records[1].hostname).to.equal(host)
    expect(ringBuffer.records[1].v).to.equal(0)
    expect(ringBuffer.records[1].msg).to.equal('Test Message')

    await logger.log(LogLevel.INFO, '', '', 'Test Message', {})

    expect(ringBuffer.records).to.have.length(3)
    expect(ringBuffer.records[2].level).to.equal(30)
    expect(ringBuffer.records[2].hostname).to.equal(host)
    expect(ringBuffer.records[2].v).to.equal(0)
    expect(ringBuffer.records[2].msg).to.equal('Test Message')

    await logger.log(LogLevel.WARN, '', '', 'Test Message', {})

    expect(ringBuffer.records).to.have.length(4)
    expect(ringBuffer.records[3].level).to.equal(40)
    expect(ringBuffer.records[3].hostname).to.equal(host)
    expect(ringBuffer.records[3].v).to.equal(0)
    expect(ringBuffer.records[3].msg).to.equal('Test Message')

    await logger.log(LogLevel.ERROR, '', '', 'Test Message', {})

    expect(ringBuffer.records).to.have.length(5)
    expect(ringBuffer.records[4].level).to.equal(50)
    expect(ringBuffer.records[4].hostname).to.equal(host)
    expect(ringBuffer.records[4].v).to.equal(0)
    expect(ringBuffer.records[4].msg).to.equal('Test Message')
  }

  @test
  public async checkArgumentPassing (): Promise<void> {
    const logger = new BunyanLoggerImplementation()
    const ringBuffer = new Logger.RingBuffer({ limit: 100 })

    logger.setLoggerBuilder((options: Logger.LoggerOptions) => {
      return Logger.createLogger(merge({}, options, {
        streams: [{
          type: 'raw',
          stream: ringBuffer,
          level: Logger.TRACE
        }]
      }))
    })

    expect(ringBuffer.records).to.have.length(0)

    await logger.log(LogLevel.INFO, '', '', 'Test Message', {})

    expect(ringBuffer.records).to.have.length(1)
    expect(ringBuffer.records[0].level).to.equal(30)
    expect(ringBuffer.records[0].hostname).to.equal(host)
    expect(ringBuffer.records[0].v).to.equal(0)
    expect(ringBuffer.records[0].msg).to.equal('Test Message')

    await logger.log(LogLevel.INFO, '', '', 'Test Message', { key: 'value' }, {})

    expect(ringBuffer.records).to.have.length(2)
    expect(ringBuffer.records[1].level).to.equal(30)
    expect(ringBuffer.records[1].hostname).to.equal(host)
    expect(ringBuffer.records[1].v).to.equal(0)
    expect(ringBuffer.records[1].msg).to.equal('Test Message { key: \'value\' }')

    const error = new Error()
    await logger.log(LogLevel.INFO, '', '', 'Test Message', error, {})

    expect(ringBuffer.records).to.have.length(3)
    expect(ringBuffer.records[2].level).to.equal(30)
    expect(ringBuffer.records[2].hostname).to.equal(host)
    expect(ringBuffer.records[2].v).to.equal(0)
    expect(ringBuffer.records[2].msg).to.startsWith('Test Message Error\n')

    await logger.log(LogLevel.INFO, '', '', 'Test Message', error, { key: 'value' }, {})

    expect(ringBuffer.records).to.have.length(4)
    expect(ringBuffer.records[3].level).to.equal(30)
    expect(ringBuffer.records[3].hostname).to.equal(host)
    expect(ringBuffer.records[3].v).to.equal(0)
    expect(ringBuffer.records[3].msg).to.startsWith('Test Message Error\n')
    expect(ringBuffer.records[3].msg).to.endsWith(' { key: \'value\' }')

    logger.setMetadata({
      user: 'username'
    }, '', '')

    await logger.log(LogLevel.INFO, '', '', 'Test Message', error, { key: 'value' }, {})

    expect(ringBuffer.records).to.have.length(5)
    expect(ringBuffer.records[4].level).to.equal(30)
    expect(ringBuffer.records[4].hostname).to.equal(host)
    expect(ringBuffer.records[4].v).to.equal(0)
    expect(ringBuffer.records[4].user).to.equal('username')
    expect(ringBuffer.records[4].msg).to.startsWith('Test Message Error\n')
    expect(ringBuffer.records[4].msg).to.endsWith(' { key: \'value\' }')
  }

  @test
  public async checkArgumentPassingWithNamedLogger (): Promise<void> {
    const logger = new BunyanLoggerImplementation()
    const ringBuffer = new Logger.RingBuffer({ limit: 100 })

    logger.setLoggerBuilder((options: Logger.LoggerOptions) => {
      return Logger.createLogger(merge({}, options, {
        streams: [{
          type: 'raw',
          stream: ringBuffer,
          level: Logger.TRACE
        }]
      }))
    })

    expect(ringBuffer.records).to.have.length(0)

    const error = new Error()
    await logger.log(LogLevel.INFO, 'group', 'name', 'Test Message', error, { key: 'value' }, {})

    expect(ringBuffer.records).to.have.length(1)
    expect(ringBuffer.records[0].level).to.equal(30)
    expect(ringBuffer.records[0].hostname).to.equal(host)
    expect(ringBuffer.records[0].v).to.equal(0)
    expect(ringBuffer.records[0].name).to.equal('group:name')
    expect(ringBuffer.records[0].msg).to.startsWith('Test Message Error\n')
    expect(ringBuffer.records[0].msg).to.endsWith(' { key: \'value\' }')

    logger.setMetadata({
      user: 'username'
    }, 'group', 'name')

    await logger.log(LogLevel.INFO, 'group', 'name', 'Test Message', error, { key: 'value' }, {})

    expect(ringBuffer.records).to.have.length(2)
    expect(ringBuffer.records[1].level).to.equal(30)
    expect(ringBuffer.records[1].hostname).to.equal(host)
    expect(ringBuffer.records[1].v).to.equal(0)
    expect(ringBuffer.records[1].name).to.equal('group:name')
    expect(ringBuffer.records[1].user).to.equal('username')
    expect(ringBuffer.records[1].msg).to.startsWith('Test Message Error\n')
    expect(ringBuffer.records[1].msg).to.endsWith(' { key: \'value\' }')
  }
}
