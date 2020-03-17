import 'source-map-support/register'

import { Client } from 'cassandra-driver'
import { EventEmitter } from 'events'
import { ILoggerInstance, LoggerFactory } from 'slf4ts-api'

export class CassandraLogAdapter<T> {
  private readonly log: ILoggerInstance<T>;

  public constructor (emitter: Client | EventEmitter, log: ILoggerInstance<T> = null) {
    if (log === null) {
      if (emitter instanceof Client) {
        this.log = LoggerFactory.getLogger('cassandra', emitter.keyspace)
      } else {
        this.log = LoggerFactory.getLogger('cassandra')
      }
    } else {
      this.log = log
    }

    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const slf = this
    emitter.on('log', function (level: any, className: any, message: any, furtherInfo: any) {
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      slf.handleLog(level, className, message, furtherInfo)
    })
  }

  protected async handleLog (
    level: string,
    className: string | undefined,
    message: string,
    furtherInfo: any | undefined): Promise<void> {
    const args: any[] = []
    if (className) {
      args.push(`${className} - ${message}`)
    } else {
      args.push(message)
    }
    if (furtherInfo) {
      args.push(furtherInfo)
    }

    /* eslint-disable @typescript-eslint/no-floating-promises */
    if (level === 'verbose') {
      this.log.debug(...args)
    } else if (level === 'info') {
      this.log.info(...args)
    } else if (level === 'warning') {
      this.log.warn(...args)
    } else if (level === 'error') {
      this.log.error(...args)
    } else {
      this.log.info(...args)
    }
    /* eslint-disable @typescript-eslint/no-floating-promises */
  }
}
