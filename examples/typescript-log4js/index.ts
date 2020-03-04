import {
    LoggingEvent,
    configure,
    getLogger,
} from 'log4js'
import {
    LoggerConfiguration,
    LoggerFactory,
    LogLevel,
} from 'slf4ts-api'

const slf4tsLogger = LoggerFactory.getLogger('domainA', 'componentB')
const log4jsLogger = getLogger()

configure({
    appenders: {
        out: {
            type: 'stdout',
            layout: {
                type: 'pattern',
                pattern: '%[%d %p %c %X{user} %m%n%]'
            }
        }
    },
    categories: {
        default: {
            appenders: ['out'],
            level: 'debug'
        },
        'domainA:componentB': {
            appenders: ['out'],
            level: 'trace'
        }
    }
})

LoggerConfiguration.setLogLevel(LogLevel.TRACE, 'domainA', 'componentB')

log4jsLogger.level = 'debug'
log4jsLogger.debug('simple LOG4JS log message')

slf4tsLogger.trace('SLF4TS TRACE log message with number', 123)
slf4tsLogger.debug('SLF4TS DEBUG log message with additional string', 'Test String')
slf4tsLogger.info('SLF4TS INFO log message with object', { abc: 'def' })
slf4tsLogger.warn('SLF4TS WARN log message with array', ['Test String'])
slf4tsLogger.error('SLF4TS ERROR log message with error', new Error())

slf4tsLogger.setMetadata({
    'user': (logEntry: LoggingEvent) => 'computed-value'
})
slf4tsLogger.trace('SLF4TS TRACE log message with number', 123)
slf4tsLogger.debug('SLF4TS DEBUG log message with additional string', 'Test String')
slf4tsLogger.info('SLF4TS INFO log message with object', { abc: 'def' })
slf4tsLogger.warn('SLF4TS WARN log message with array', ['Test String'])
slf4tsLogger.error('SLF4TS ERROR log message with error', new Error())
