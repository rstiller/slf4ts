import {
  LoggerConfiguration,
  LoggerFactory,
  LogLevel
} from 'slf4ts-api'

LoggerConfiguration.setDefaultLogLevel(LogLevel.TRACE)

const slf4tsLogger = LoggerFactory.getLogger('domainA', 'componentB')

slf4tsLogger.trace('SLF4TS TRACE log message with number', 123)
  .catch(console.error)
slf4tsLogger.debug('SLF4TS DEBUG log message with additional string', 'Test String')
  .catch(console.error)
slf4tsLogger.info('SLF4TS INFO log message with object', { abc: 'def' })
  .catch(console.error)
slf4tsLogger.warn('SLF4TS WARN log message with array', ['Test String'])
  .catch(console.error)
slf4tsLogger.error('SLF4TS ERROR log message with error', new Error())
  .catch(console.error)

console.log('\n\n\n')

slf4tsLogger.setMetadata({
  user: 'username'
})
slf4tsLogger.trace('SLF4TS TRACE log message with number', 123)
  .catch(console.error)
slf4tsLogger.debug('SLF4TS DEBUG log message with additional string', 'Test String')
  .catch(console.error)
slf4tsLogger.info('SLF4TS INFO log message with object', { abc: 'def' })
  .catch(console.error)
slf4tsLogger.warn('SLF4TS WARN log message with array', ['Test String'])
  .catch(console.error)
slf4tsLogger.error('SLF4TS ERROR log message with error', new Error())
  .catch(console.error)
