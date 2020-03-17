import 'source-map-support/register'

import * as fs from 'fs'
import * as path from 'path'
import { Logger } from 'pino'
import { LoggerBinding } from 'slf4ts-api'

import { PinoLoggerImplementation } from './PinoLoggerImplementation'

/**
 * LoggerBinding implementation for Pino.
 *
 * @export
 * @class PinoLoggerBinding
 * @implements {LoggerBinding}
 */
export class PinoLoggerBinding implements LoggerBinding<Logger> {
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

  public getLoggerImplementation (): PinoLoggerImplementation {
    return new PinoLoggerImplementation()
  }

  public getVendor (): string {
    return 'pino'
  }

  public getVersion (): string {
    return this.packageJson.version
  }
}
