import 'source-map-support/register'

import * as fs from 'fs'
import * as path from 'path'
import { Logger } from 'loglevel'
import { LoggerBinding } from 'slf4ts-api'

import { LoglevelLoggerImplementation } from './LoglevelLoggerImplementation'

/**
 * LoggerBinding implementation for Loglevel.
 *
 * @export
 * @class LoglevelLoggerBinding
 * @implements {LoggerBinding}
 */
export class LoglevelLoggerBinding implements LoggerBinding<Logger> {
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

  public getLoggerImplementation (): LoglevelLoggerImplementation {
    return new LoglevelLoggerImplementation()
  }

  public getVendor (): string {
    return 'loglevel'
  }

  public getVersion (): string {
    return this.packageJson.version
  }
}
