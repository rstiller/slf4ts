import 'source-map-support/register'

import * as fs from 'fs'
import * as path from 'path'
import { Logger } from 'log4js'
import { LoggerBinding } from 'slf4ts-api'

import { Log4JSLoggerImplementation } from './Log4JSLoggerImplementation'

/**
 * LoggerBinding implementation for Log4JS.
 *
 * @export
 * @class Log4JSLoggerBinding
 * @implements {LoggerBinding}
 */
export class Log4JSLoggerBinding implements LoggerBinding<Logger, [string]> {
  private readonly packageJson: any;

  public constructor () {
    const modulePath = path.parse(module.filename)
    let currentDir = path.resolve(modulePath.dir)
    while (true) {
      currentDir = path.resolve(path.join(currentDir, '..'))
      const packageJsonPath = path.resolve(path.join(currentDir, 'package.json'))
      if (fs.existsSync(packageJsonPath)) {
        this.packageJson = require(packageJsonPath)
        break
      }
    }
  }

  public getLoggerImplementation (): Log4JSLoggerImplementation {
    return new Log4JSLoggerImplementation()
  }

  public getVendor (): string {
    return 'log4js'
  }

  public getVersion (): string {
    return this.packageJson.version
  }
}
