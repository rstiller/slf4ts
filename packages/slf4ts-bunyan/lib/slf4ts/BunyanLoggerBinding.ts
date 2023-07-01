import 'source-map-support/register'

import * as fs from 'fs'
import * as path from 'path'
import type * as Logger from 'bunyan'
import { type LoggerBinding } from 'slf4ts-api'

import { BunyanLoggerImplementation } from './BunyanLoggerImplementation'

/**
 * LoggerBinding implementation for Bunyan.
 *
 * @export
 * @class BunyanLoggerBinding
 * @implements {LoggerBinding}
 */
export class BunyanLoggerBinding implements LoggerBinding<Logger, [Logger.LoggerOptions]> {
  private readonly packageJson: any

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

  public getLoggerImplementation (): BunyanLoggerImplementation {
    return new BunyanLoggerImplementation()
  }

  public getVendor (): string {
    return 'bunyan'
  }

  public getVersion (): string {
    return this.packageJson.version
  }
}
