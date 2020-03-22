const log = require('loglevel')
const {
  LoggerConfiguration,
  LoggerFactory,
  LogLevel
} = require('slf4ts-api')

const slf4tsLogger = LoggerFactory.getLogger('domainA', 'componentB')

LoggerConfiguration.setLogLevel(LogLevel.TRACE, 'domainA', 'componentB')

slf4tsLogger.trace('SLF4TS TRACE log message with number', 123)
slf4tsLogger.debug('SLF4TS DEBUG log message with additional string', 'Test String')
slf4tsLogger.info('SLF4TS INFO log message with object', { abc: 'def' })
slf4tsLogger.warn('SLF4TS WARN log message with array', ['Test String'])
slf4tsLogger.error('SLF4TS ERROR log message with error', new Error())

console.log('\n\n\n')

slf4tsLogger.setMetadata({
  user: 'username'
})
slf4tsLogger.trace('SLF4TS TRACE log message with number', 123)
slf4tsLogger.debug('SLF4TS DEBUG log message with additional string', 'Test String')
slf4tsLogger.info('SLF4TS INFO log message with object', { abc: 'def' })
slf4tsLogger.warn('SLF4TS WARN log message with array', ['Test String'])
slf4tsLogger.error('SLF4TS ERROR log message with error', new Error())

console.log('\n\n\n')

const logger = log.getLogger('logger')
logger.setLevel('trace')

logger.trace('LOGLEVEL TRACE log message')
logger.debug('LOGLEVEL DEBUG log message')
logger.info('LOGLEVEL INFO log message')
logger.warn('LOGLEVEL WARN log message')
logger.error('LOGLEVEL ERROR log message')

console.log('\n\n\n')

logger.trace({ user: 'username' }, 'LOGLEVEL TRACE log message')
logger.debug({ user: 'username' }, 'LOGLEVEL DEBUG log message')
logger.info({ user: 'username' }, 'LOGLEVEL INFO log message')
logger.warn({ user: 'username' }, 'LOGLEVEL WARN log message')
logger.error({ user: 'username' }, 'LOGLEVEL ERROR log message')

console.log('\n\n\n')

logger.trace('LOGLEVEL TRACE log message', new Error('custom error'))
logger.debug('LOGLEVEL DEBUG log message', new Error('custom error'))
logger.info('LOGLEVEL INFO log message', new Error('custom error'))
logger.warn('LOGLEVEL WARN log message', new Error('custom error'))
logger.error('LOGLEVEL ERROR log message', new Error('custom error'))
