const winston = require('winston')
const {
  LoggerConfiguration,
  LoggerFactory,
  LogLevel
} = require('slf4ts-api')

const transports = [new winston.transports.Console({
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.simple()
  ),
  level: 'silly'
})]

LoggerConfiguration.setConfig({ transports })
LoggerConfiguration.setDefaultLogLevel(LogLevel.TRACE)

const slf4tsLogger = LoggerFactory.getLogger('domainA', 'componentB')

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

const winstonLogger = winston.createLogger({
  level: 'silly',
  defaultMeta: { user: 'username' },
  transports
})

winstonLogger.silly('WINSTON TRACE log message')
winstonLogger.debug('WINSTON DEBUG log message')
winstonLogger.info('WINSTON INFO log message')
winstonLogger.warn('WINSTON WARN log message')
winstonLogger.error('WINSTON ERROR log message')

console.log('\n\n\n')

winstonLogger.silly('WINSTON TRACE log message ', new Error('custom error'))
winstonLogger.debug('WINSTON DEBUG log message ', new Error('custom error'))
winstonLogger.info('WINSTON INFO log message ', new Error('custom error'))
winstonLogger.warn('WINSTON WARN log message ', new Error('custom error'))
winstonLogger.error('WINSTON ERROR log message ', new Error('custom error'))
