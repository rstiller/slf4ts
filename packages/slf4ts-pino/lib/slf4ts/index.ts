import 'source-map-support/register'

import { LoggerBindings } from 'slf4ts-api'
import { PinoLoggerBinding } from './PinoLoggerBinding'

/**
 * Instances a new {@link PinoLoggerBinding}
 *
 * @export
 * @param {LoggerBindings} registry The bindings collection to register with.
 */
module.exports = function (registry: LoggerBindings) {
  registry.registerBinding(new PinoLoggerBinding())
}
