import 'source-map-support/register'

import { LoggerBindings } from 'slf4ts-api'
import { LoglevelLoggerBinding } from './LoglevelLoggerBinding'

/**
 * Instances a new {@link LoglevelLoggerBinding}
 *
 * @export
 * @param {LoggerBindings} registry The bindings collection to register with.
 */
module.exports = function (registry: LoggerBindings) {
  registry.registerBinding(new LoglevelLoggerBinding())
}
