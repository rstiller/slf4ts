import {
  LoggerConfiguration,
  LoggerFactory,
  LogLevel
} from 'slf4ts-api'

const slf4tsLogger = LoggerFactory.getLogger('domainA', 'componentB')

LoggerConfiguration.setLogLevel(LogLevel.TRACE, 'domainA', 'componentB')

slf4tsLogger.trace('SLF4TS TRACE log message with number', 123)
  .catch(console.log)
slf4tsLogger.debug('SLF4TS DEBUG log message with additional string', 'Test String')
  .catch(console.log)
slf4tsLogger.info('SLF4TS INFO log message with object', { abc: 'def' })
  .catch(console.log)
slf4tsLogger.warn('SLF4TS WARN log message with array', ['Test String'])
  .catch(console.log)
slf4tsLogger.error('SLF4TS ERROR log message with error', new Error())
  .catch(console.log)

console.log('\n\n\n')

slf4tsLogger.setMetadata({
  user: 'username'
})
slf4tsLogger.trace('SLF4TS TRACE log message with number', 123)
  .catch(console.log)
slf4tsLogger.debug('SLF4TS DEBUG log message with additional string', 'Test String')
  .catch(console.log)
slf4tsLogger.info('SLF4TS INFO log message with object', { abc: 'def' })
  .catch(console.log)
slf4tsLogger.warn('SLF4TS WARN log message with array', ['Test String'])
  .catch(console.log)
slf4tsLogger.error('SLF4TS ERROR log message with error', new Error())
  .catch(console.log)
