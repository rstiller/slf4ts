/* eslint-env mocha */
/* eslint-disable @typescript-eslint/no-unused-expressions */

import 'source-map-support/register'

import * as chai from 'chai'
import { suite, test } from '@testdeck/mocha'
import * as path from 'path'

import { LoggerConfiguration, LogLevel } from '../../lib/slf4ts/LoggerConfiguration'
import { type DefaultLoggerInstance, LoggerFactory } from '../../lib/slf4ts/LoggerFactory'

const expect = chai.expect
const fail = chai.assert.fail

// hack to re-initialize the path for module resolution
const nodeModuleExtraPath = path.join(__dirname, '..', '..', 'example-node-modules')
process.env.NODE_PATH = nodeModuleExtraPath
process.env.LOGGER_BINDING_ADDITIONAL_PATH = nodeModuleExtraPath
require('module').Module._initPaths() // eslint-disable-line @typescript-eslint/no-var-requires

@suite
export class LoggerFactoryTest {
  public before (): void {
    LoggerConfiguration.reset()
    LoggerFactory.reset(true)
  }

  @test
  public checkRootLogger (): void {
    const logger = LoggerFactory.getLogger()
    const loggerImpl = (logger as DefaultLoggerInstance<any, any[]>).getImpl() as any
    logger.setMetadata({ mode: 'Test' })

    expect(loggerImpl).to.exist

    logger.info('Test Message')
      .catch(fail)
    expect(loggerImpl.calls).to.have.length(1)
    expect(loggerImpl.calls[0][0]).to.equal(LogLevel.INFO)
    expect(loggerImpl.calls[0][1]).to.equal('')
    expect(loggerImpl.calls[0][2]).to.equal('')
    expect(loggerImpl.calls[0][3]).to.equal('Test Message')
    expect(loggerImpl.calls[0][4]).to.deep.equal({ mode: 'Test' })
  }

  @test
  public checkRootLogLevel (): void {
    const logger = LoggerFactory.getLogger()

    expect(logger.getLogLevel()).to.equal(LogLevel.INFO)
  }

  @test
  public checkSetRootLogLevel (): void {
    const logger = LoggerFactory.getLogger()

    expect(logger.getLogLevel()).to.equal(LogLevel.INFO)

    LoggerConfiguration.setLogLevel(LogLevel.DEBUG)

    expect(logger.getLogLevel()).to.equal(LogLevel.DEBUG)
  }

  @test
  public checkGetImplementation (): void {
    const logger = LoggerFactory.getLogger()

    expect(logger.getImplementation()).to.equal(console)
  }

  @test
  public checkGetNamedLogger (): void {
    const group = 'group1'
    const name = 'name1'

    /* eslint-disable no-self-compare */
    expect(LoggerFactory.getLogger() === LoggerFactory.getLogger()).to.be.true
    expect(LoggerFactory.getLogger(group) === LoggerFactory.getLogger(group)).to.be.true
    expect(LoggerFactory.getLogger(group, name) === LoggerFactory.getLogger(group, name)).to.be.true
    expect(LoggerFactory.getLogger(group) !== LoggerFactory.getLogger(group, name)).to.be.true
    expect(LoggerFactory.getLogger() !== LoggerFactory.getLogger(group)).to.be.true
    expect(LoggerFactory.getLogger() !== LoggerFactory.getLogger(group, name)).to.be.true
    /* eslint-disable no-self-compare */
  }

  @test
  public checkSetLogLevel (): void {
    const group = 'group1'
    const name1 = 'name1'
    const name2 = 'name2'
    const rootLogger = LoggerFactory.getLogger()
    const loggerImpl = (rootLogger as DefaultLoggerInstance<any, any[]>).getImpl() as any
    const groupLogger = LoggerFactory.getLogger(group)
    const namedLogger1 = LoggerFactory.getLogger(group, name1)
    const namedLogger2 = LoggerFactory.getLogger(group, name2)

    expect(rootLogger.getLogLevel()).to.equal(LogLevel.INFO)
    expect(groupLogger.getLogLevel()).to.equal(LogLevel.INFO)
    expect(namedLogger1.getLogLevel()).to.equal(LogLevel.INFO)
    expect(namedLogger2.getLogLevel()).to.equal(LogLevel.INFO)

    LoggerConfiguration.setLogLevel(LogLevel.DEBUG, group, name1)

    expect(loggerImpl.setLogLevelCalls).to.have.length(1)
    expect(loggerImpl.setLogLevelCalls[0][0]).to.deep.equal(LogLevel.DEBUG)
    expect(loggerImpl.setLogLevelCalls[0][1]).to.equal(group)
    expect(loggerImpl.setLogLevelCalls[0][2]).to.equal(name1)

    expect(rootLogger.getLogLevel()).to.equal(LogLevel.INFO)
    expect(groupLogger.getLogLevel()).to.equal(LogLevel.INFO)
    expect(namedLogger1.getLogLevel()).to.equal(LogLevel.DEBUG)
    expect(namedLogger2.getLogLevel()).to.equal(LogLevel.INFO)

    LoggerConfiguration.setLogLevel(LogLevel.TRACE, group)

    expect(loggerImpl.setLogLevelCalls).to.have.length(4)
    expect(loggerImpl.setLogLevelCalls[1][0]).to.deep.equal(LogLevel.TRACE)
    expect(loggerImpl.setLogLevelCalls[1][1]).to.equal(group)
    expect(loggerImpl.setLogLevelCalls[1][2]).to.equal('')
    expect(loggerImpl.setLogLevelCalls[2][0]).to.deep.equal(LogLevel.TRACE)
    expect(loggerImpl.setLogLevelCalls[2][1]).to.equal(group)
    expect(loggerImpl.setLogLevelCalls[2][2]).to.equal(name1)
    expect(loggerImpl.setLogLevelCalls[3][0]).to.deep.equal(LogLevel.TRACE)
    expect(loggerImpl.setLogLevelCalls[3][1]).to.equal(group)
    expect(loggerImpl.setLogLevelCalls[3][2]).to.equal(name2)

    expect(rootLogger.getLogLevel()).to.equal(LogLevel.INFO)
    expect(groupLogger.getLogLevel()).to.equal(LogLevel.TRACE)
    expect(namedLogger1.getLogLevel()).to.equal(LogLevel.TRACE)
    expect(namedLogger2.getLogLevel()).to.equal(LogLevel.TRACE)
  }

  @test
  public checkCorrectLogLevelInvocations (): void {
    const logger = LoggerFactory.getLogger('group1', 'name1')
    const loggerImpl = (logger as DefaultLoggerInstance<any, any[]>).getImpl() as any
    logger.setMetadata({ mode: 'Test' })

    expect(loggerImpl).to.exist

    LoggerConfiguration.setLogLevel(LogLevel.INFO)
    expect(logger.getLogLevel()).to.equal(LogLevel.INFO)
    logger.info('Test Message 1')
      .catch(fail)

    expect(loggerImpl.calls).to.have.length(1)
    expect(loggerImpl.calls[0][0]).to.equal(LogLevel.INFO)
    expect(loggerImpl.calls[0][1]).to.equal('group1')
    expect(loggerImpl.calls[0][2]).to.equal('name1')
    expect(loggerImpl.calls[0][3]).to.equal('Test Message 1')
    expect(loggerImpl.calls[0][4]).to.deep.equal({ mode: 'Test' })

    LoggerConfiguration.setLogLevel(LogLevel.WARN)
    expect(logger.getLogLevel()).to.equal(LogLevel.WARN)
    logger.info('Test Message 2')
      .catch(fail)

    expect(loggerImpl.calls).to.have.length(1)

    LoggerConfiguration.setLogLevel(LogLevel.DEBUG)
    expect(logger.getLogLevel()).to.equal(LogLevel.DEBUG)
    logger.info('Test Message 3')
      .catch(fail)

    expect(loggerImpl.calls).to.have.length(2)
    expect(loggerImpl.calls[1][0]).to.equal(LogLevel.INFO)
    expect(loggerImpl.calls[1][1]).to.equal('group1')
    expect(loggerImpl.calls[1][2]).to.equal('name1')
    expect(loggerImpl.calls[1][3]).to.equal('Test Message 3')
    expect(loggerImpl.calls[1][4]).to.deep.equal({ mode: 'Test' })
  }

  @test
  public checkMetadataArguments (): void {
    const logger = LoggerFactory.getLogger('group1', 'name1')
    const loggerImpl = (logger as DefaultLoggerInstance<any, any[]>).getImpl() as any

    logger.info('Test Message 1')
      .catch(fail)
    expect(loggerImpl.calls).to.have.length(1)
    expect(loggerImpl.calls[0]).to.have.length(5)
    expect(loggerImpl.calls[0][4]).to.not.exist

    logger.info('Test Message 2', { arg1: 'value1' })
      .catch(fail)
    expect(loggerImpl.calls).to.have.length(2)
    expect(loggerImpl.calls[1]).to.have.length(6)
    expect(loggerImpl.calls[1][4]).to.deep.equal({ arg1: 'value1' })
    expect(loggerImpl.calls[1][5]).to.not.exist

    logger.setMetadata({ mode: 'Test', version: '1.0.0' })
    logger.info('Test Message 3')
      .catch(fail)

    expect(loggerImpl.calls).to.have.length(3)
    expect(loggerImpl.calls[2]).to.have.length(5)
    expect(loggerImpl.calls[2][4]).to.deep.equal({ mode: 'Test', version: '1.0.0' })

    logger.info('Test Message 4', { arg1: 'value1' })
      .catch(fail)

    expect(loggerImpl.calls).to.have.length(4)
    expect(loggerImpl.calls[3]).to.have.length(6)
    expect(loggerImpl.calls[3][4]).to.deep.equal({ arg1: 'value1' })
    expect(loggerImpl.calls[3][5]).to.deep.equal({ mode: 'Test', version: '1.0.0' })

    const error = new Error('Test')
    logger.info('Test Message 5', { arg1: 'value1' }, error)
      .catch(fail)

    expect(loggerImpl.calls).to.have.length(5)
    expect(loggerImpl.calls[4]).to.have.length(7)
    expect(loggerImpl.calls[4][4]).to.deep.equal({ arg1: 'value1' })
    expect(loggerImpl.calls[4][5]).to.equal(error)
    expect(loggerImpl.calls[4][6]).to.deep.equal({ mode: 'Test', version: '1.0.0' })

    logger.info('Test Message 6', null, error)
      .catch(fail)

    expect(loggerImpl.calls).to.have.length(6)
    expect(loggerImpl.calls[5]).to.have.length(7)
    expect(loggerImpl.calls[5][4]).to.be.null
    expect(loggerImpl.calls[5][5]).to.equal(error)
    expect(loggerImpl.calls[5][6]).to.deep.equal({ mode: 'Test', version: '1.0.0' })

    logger.info('Test Message 7', error)
      .catch(fail)

    expect(loggerImpl.calls).to.have.length(7)
    expect(loggerImpl.calls[6]).to.have.length(6)
    expect(loggerImpl.calls[6][4]).to.equal(error)
    expect(loggerImpl.calls[6][5]).to.deep.equal({ mode: 'Test', version: '1.0.0' })
  }

  @test
  public checkSetConfig (): void {
    const group = 'group1'
    const name1 = 'name1'
    const name2 = 'name2'
    const rootLogger = LoggerFactory.getLogger()
    const loggerImpl = (rootLogger as DefaultLoggerInstance<any, any[]>).getImpl() as any

    LoggerFactory.getLogger(group)
    LoggerFactory.getLogger(group, name1)
    LoggerFactory.getLogger(group, name2)

    expect(LoggerConfiguration.getConfig()).to.not.exist
    expect(LoggerConfiguration.getConfig(group)).to.not.exist
    expect(LoggerConfiguration.getConfig(group, name1)).to.not.exist
    expect(LoggerConfiguration.getConfig(group, name2)).to.not.exist

    // each logger asks or it's config on construction
    expect(loggerImpl.setConfigCalls).to.have.length(4)
    // clear calls ...
    loggerImpl.setConfigCalls.splice(0, 4)

    const config1 = { key: 'value1' }
    const config2 = { key: 'value2' }
    const config3 = { key: 'value3' }

    LoggerConfiguration.setConfig(config1)

    expect(LoggerConfiguration.getConfig()).to.equal(config1)
    expect(LoggerConfiguration.getConfig(group)).to.equal(config1)
    expect(LoggerConfiguration.getConfig(group, name1)).to.equal(config1)
    expect(LoggerConfiguration.getConfig(group, name2)).to.equal(config1)

    expect(loggerImpl.setConfigCalls).to.have.length(4)
    expect(loggerImpl.setConfigCalls[0][0]).to.deep.equal(config1)
    expect(loggerImpl.setConfigCalls[0][1]).to.equal('')
    expect(loggerImpl.setConfigCalls[0][2]).to.equal('')
    expect(loggerImpl.setConfigCalls[1][0]).to.deep.equal(config1)
    expect(loggerImpl.setConfigCalls[1][1]).to.equal(group)
    expect(loggerImpl.setConfigCalls[1][2]).to.equal('')
    expect(loggerImpl.setConfigCalls[2][0]).to.deep.equal(config1)
    expect(loggerImpl.setConfigCalls[2][1]).to.equal(group)
    expect(loggerImpl.setConfigCalls[2][2]).to.equal(name1)
    expect(loggerImpl.setConfigCalls[3][0]).to.deep.equal(config1)
    expect(loggerImpl.setConfigCalls[3][1]).to.equal(group)
    expect(loggerImpl.setConfigCalls[3][2]).to.equal(name2)

    LoggerConfiguration.setConfig(config2, group)

    expect(LoggerConfiguration.getConfig()).to.equal(config1)
    expect(LoggerConfiguration.getConfig(group)).to.equal(config2)
    expect(LoggerConfiguration.getConfig(group, name1)).to.equal(config2)
    expect(LoggerConfiguration.getConfig(group, name2)).to.equal(config2)

    expect(loggerImpl.setConfigCalls).to.have.length(7)
    expect(loggerImpl.setConfigCalls[4][0]).to.deep.equal(config2)
    expect(loggerImpl.setConfigCalls[4][1]).to.equal(group)
    expect(loggerImpl.setConfigCalls[4][2]).to.equal('')
    expect(loggerImpl.setConfigCalls[5][0]).to.deep.equal(config2)
    expect(loggerImpl.setConfigCalls[5][1]).to.equal(group)
    expect(loggerImpl.setConfigCalls[5][2]).to.equal(name1)
    expect(loggerImpl.setConfigCalls[6][0]).to.deep.equal(config2)
    expect(loggerImpl.setConfigCalls[6][1]).to.equal(group)
    expect(loggerImpl.setConfigCalls[6][2]).to.equal(name2)

    LoggerConfiguration.setConfig(config3, group, name1)

    expect(LoggerConfiguration.getConfig()).to.equal(config1)
    expect(LoggerConfiguration.getConfig(group)).to.equal(config2)
    expect(LoggerConfiguration.getConfig(group, name1)).to.equal(config3)
    expect(LoggerConfiguration.getConfig(group, name2)).to.equal(config2)

    expect(loggerImpl.setConfigCalls).to.have.length(8)
    expect(loggerImpl.setConfigCalls[7][0]).to.deep.equal(config3)
    expect(loggerImpl.setConfigCalls[7][1]).to.equal(group)
    expect(loggerImpl.setConfigCalls[7][2]).to.equal(name1)
  }

  @test
  public checkConfigInheritance (): void {
    const group = 'group1'
    const name1 = 'name1'
    const name2 = 'name2'
    const rootLogger = LoggerFactory.getLogger()
    const loggerImpl = (rootLogger as DefaultLoggerInstance<any, any[]>).getImpl() as any

    LoggerFactory.getLogger(group)
    LoggerFactory.getLogger(group, name1)
    LoggerFactory.getLogger(group, name2)

    expect(LoggerConfiguration.getConfig()).to.not.exist
    expect(LoggerConfiguration.getConfig(group)).to.not.exist
    expect(LoggerConfiguration.getConfig(group, name1)).to.not.exist
    expect(LoggerConfiguration.getConfig(group, name2)).to.not.exist

    // clear calls ...
    loggerImpl.setConfigCalls.splice(0, 4)

    const config1 = { key: 'value1' }
    const config2 = { key: 'value2' }
    const config3 = { key: 'value3' }

    expect(loggerImpl.setConfigCalls).to.have.length(0)

    LoggerConfiguration.setConfig(config1, group, name1)

    expect(LoggerConfiguration.getConfig()).to.not.exist
    expect(LoggerConfiguration.getConfig(group)).to.not.exist
    expect(LoggerConfiguration.getConfig(group, name1)).to.equal(config1)
    expect(LoggerConfiguration.getConfig(group, name2)).to.not.exist

    expect(loggerImpl.setConfigCalls).to.have.length(1)
    expect(loggerImpl.setConfigCalls[0][0]).to.deep.equal(config1)
    expect(loggerImpl.setConfigCalls[0][1]).to.equal(group)
    expect(loggerImpl.setConfigCalls[0][2]).to.equal(name1)

    LoggerConfiguration.setConfig(config2, group)

    expect(LoggerConfiguration.getConfig()).to.not.exist
    expect(LoggerConfiguration.getConfig(group)).to.equal(config2)
    expect(LoggerConfiguration.getConfig(group, name1)).to.equal(config1)
    expect(LoggerConfiguration.getConfig(group, name2)).to.equal(config2)

    expect(loggerImpl.setConfigCalls).to.have.length(3)
    expect(loggerImpl.setConfigCalls[1][0]).to.deep.equal(config2)
    expect(loggerImpl.setConfigCalls[1][1]).to.equal(group)
    expect(loggerImpl.setConfigCalls[1][2]).to.equal('')
    expect(loggerImpl.setConfigCalls[2][0]).to.deep.equal(config2)
    expect(loggerImpl.setConfigCalls[2][1]).to.equal(group)
    expect(loggerImpl.setConfigCalls[2][2]).to.equal(name2)

    LoggerConfiguration.setConfig(config3)

    expect(LoggerConfiguration.getConfig()).to.equal(config3)
    expect(LoggerConfiguration.getConfig(group)).to.equal(config2)
    expect(LoggerConfiguration.getConfig(group, name1)).to.equal(config1)
    expect(LoggerConfiguration.getConfig(group, name2)).to.equal(config2)

    expect(loggerImpl.setConfigCalls).to.have.length(4)
    expect(loggerImpl.setConfigCalls[3][0]).to.deep.equal(config3)
    expect(loggerImpl.setConfigCalls[3][1]).to.equal('')
    expect(loggerImpl.setConfigCalls[3][2]).to.equal('')
  }

  @test
  public checkSetMetadataOnLoggerFactory (): void {
    const logger = LoggerFactory.getLogger()
    const loggerImpl = (logger as DefaultLoggerInstance<any, any[]>).getImpl() as any

    logger.info('Test Message 1')
      .catch(fail)
    expect(loggerImpl.calls).to.have.length(1)
    expect(loggerImpl.calls[0]).to.have.length(5)
    expect(loggerImpl.calls[0][4]).to.not.exist

    LoggerFactory.setMetadata({ arg1: 'value1' })

    logger.info('Test Message 2')
      .catch(fail)
    expect(loggerImpl.calls).to.have.length(2)
    expect(loggerImpl.calls[1]).to.have.length(5)
    expect(loggerImpl.calls[1][4]).to.deep.equal({ arg1: 'value1' })

    LoggerFactory.setMetadata({ arg1: 'value2', arg2: 'value3' })

    logger.info('Test Message 3')
      .catch(fail)
    expect(loggerImpl.calls).to.have.length(3)
    expect(loggerImpl.calls[2]).to.have.length(5)
    expect(loggerImpl.calls[2][4]).to.deep.equal({ arg1: 'value2', arg2: 'value3' })

    logger.setMetadata({ arg1: 'value4' })
    logger.info('Test Message 4')
      .catch(fail)
    expect(loggerImpl.calls).to.have.length(4)
    expect(loggerImpl.calls[3]).to.have.length(5)
    expect(loggerImpl.calls[3][4]).to.deep.equal({ arg1: 'value4' })

    // since the metadata of the specific logger has changed
    // the application-wide metadata are not set to it
    LoggerFactory.setMetadata({ arg1: 'value5', arg2: 'value6' })

    logger.info('Test Message 5')
      .catch(fail)
    expect(loggerImpl.calls).to.have.length(5)
    expect(loggerImpl.calls[4]).to.have.length(5)
    expect(loggerImpl.calls[4][4]).to.deep.equal({ arg1: 'value4' })
  }

  @test
  public checkSetMetadata (): void {
    LoggerFactory.setMetadata({})

    const group = 'group1'
    const name1 = 'name1'
    const name2 = 'name2'
    const rootLogger = LoggerFactory.getLogger()
    const groupLogger = LoggerFactory.getLogger(group)
    const namedLogger1 = LoggerFactory.getLogger(group, name1)
    const namedLogger2 = LoggerFactory.getLogger(group, name2)
    const loggerImpl = (rootLogger as DefaultLoggerInstance<any, any[]>).getImpl() as any
    const defaultLogger = rootLogger as DefaultLoggerInstance<any, any[]>
    const defaultGroupLogger = groupLogger as DefaultLoggerInstance<any, any[]>
    const defaultNamedLogger1 = namedLogger1 as DefaultLoggerInstance<any, any[]>
    const defaultNamedLogger2 = namedLogger2 as DefaultLoggerInstance<any, any[]>
    const rootMetadata = {
      key1: 'value1'
    }
    const namedLogger1Metadata = {
      key2: 'value2'
    }
    const groupLoggerMetadata = {
      key3: 'value3'
    }

    expect(defaultLogger.getMetadata()).to.deep.equal({})
    expect(defaultGroupLogger.getMetadata()).to.deep.equal({})
    expect(defaultNamedLogger1.getMetadata()).to.deep.equal({})
    expect(defaultNamedLogger2.getMetadata()).to.deep.equal({})

    rootLogger.setMetadata(rootMetadata)

    expect(loggerImpl.setMetadataCalls).to.have.length(1)
    expect(loggerImpl.setMetadataCalls[0][0]).to.deep.equal(rootMetadata)
    expect(loggerImpl.setMetadataCalls[0][1]).to.equal('')
    expect(loggerImpl.setMetadataCalls[0][2]).to.equal('')
    expect(defaultLogger.getMetadata()).to.deep.equal(rootMetadata)
    expect(defaultGroupLogger.getMetadata()).to.deep.equal({})
    expect(defaultNamedLogger1.getMetadata()).to.deep.equal({})
    expect(defaultNamedLogger2.getMetadata()).to.deep.equal({})

    defaultNamedLogger1.setMetadata(namedLogger1Metadata)

    expect(loggerImpl.setMetadataCalls).to.have.length(2)
    expect(loggerImpl.setMetadataCalls[1][0]).to.deep.equal(namedLogger1Metadata)
    expect(loggerImpl.setMetadataCalls[1][1]).to.equal(group)
    expect(loggerImpl.setMetadataCalls[1][2]).to.equal(name1)
    expect(defaultLogger.getMetadata()).to.deep.equal(rootMetadata)
    expect(defaultGroupLogger.getMetadata()).to.deep.equal({})
    expect(defaultNamedLogger1.getMetadata()).to.deep.equal(namedLogger1Metadata)
    expect(defaultNamedLogger2.getMetadata()).to.deep.equal({})

    defaultGroupLogger.setMetadata(groupLoggerMetadata)

    expect(loggerImpl.setMetadataCalls).to.have.length(3)
    expect(loggerImpl.setMetadataCalls[2][0]).to.deep.equal(groupLoggerMetadata)
    expect(loggerImpl.setMetadataCalls[2][1]).to.equal(group)
    expect(loggerImpl.setMetadataCalls[2][2]).to.equal('')
    expect(defaultLogger.getMetadata()).to.deep.equal(rootMetadata)
    expect(defaultGroupLogger.getMetadata()).to.deep.equal(groupLoggerMetadata)
    expect(defaultNamedLogger1.getMetadata()).to.deep.equal(namedLogger1Metadata)
    expect(defaultNamedLogger2.getMetadata()).to.deep.equal({})
  }
}
