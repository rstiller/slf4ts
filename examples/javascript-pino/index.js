const pinoLogger = require('pino')()
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

pinoLogger.level = 'trace'
pinoLogger.trace('PINO TRACE log message')
pinoLogger.debug('PINO DEBUG log message')
pinoLogger.info('PINO INFO log message')
pinoLogger.warn('PINO WARN log message')
pinoLogger.error('PINO ERROR log message')

console.log('\n\n\n')

pinoLogger.trace({ user: 'username' }, 'PINO TRACE log message')
pinoLogger.debug({ user: 'username' }, 'PINO DEBUG log message')
pinoLogger.info({ user: 'username' }, 'PINO INFO log message')
pinoLogger.warn({ user: 'username' }, 'PINO WARN log message')
pinoLogger.error({ user: 'username' }, 'PINO ERROR log message')

console.log('\n\n\n')

pinoLogger.trace(new Error('custom error'), 'PINO TRACE log message')
pinoLogger.debug(new Error('custom error'), 'PINO DEBUG log message')
pinoLogger.info(new Error('custom error'), 'PINO INFO log message')
pinoLogger.warn(new Error('custom error'), 'PINO WARN log message')
pinoLogger.error(new Error('custom error'), 'PINO ERROR log message')

console.log('\n\n\n')

const pinoChildLogger = pinoLogger.child({ user: 'username' })

pinoChildLogger.trace(new Error('custom error'), 'PINO TRACE log message')
pinoChildLogger.debug(new Error('custom error'), 'PINO DEBUG log message')
pinoChildLogger.info(new Error('custom error'), 'PINO INFO log message')
pinoChildLogger.warn(new Error('custom error'), 'PINO WARN log message')
pinoChildLogger.error(new Error('custom error'), 'PINO ERROR log message')
