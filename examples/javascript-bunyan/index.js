const bunyan = require('bunyan')
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

const bunyanLogger = bunyan.createLogger({
  name: 'originalLogger',
  level: bunyan.resolveLevel('trace')
})

bunyanLogger.trace('BUNYAN TRACE log message with number', 123)
bunyanLogger.debug('BUNYAN DEBUG log message with additional string', 'Test String')
bunyanLogger.info('BUNYAN INFO log message with object', { abc: 'def' })
bunyanLogger.warn('BUNYAN WARN log message with array', ['Test String'])
bunyanLogger.error('BUNYAN ERROR log message with error', new Error())

console.log('\n\n\n')

const bunyanChildLogger = bunyanLogger.child({ user: 'username' })

bunyanChildLogger.trace('BUNYAN TRACE log message with number', 123)
bunyanChildLogger.debug('BUNYAN DEBUG log message with additional string', 'Test String')
bunyanChildLogger.info('BUNYAN INFO log message with object', { abc: 'def' })
bunyanChildLogger.warn('BUNYAN WARN log message with array', ['Test String'])
bunyanChildLogger.error('BUNYAN ERROR log message with error', new Error())
