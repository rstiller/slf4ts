import 'source-map-support/register'

import { type LoggerBindings } from 'slf4ts-api'
import { Log4JSLoggerBinding } from './Log4JSLoggerBinding'

/**
 * Instances a new {@link Log4JSLoggerBinding}
 *
 * @export
 * @param {LoggerBindings} registry The bindings collection to register with.
 */
module.exports = function (registry: LoggerBindings) {
  registry.registerBinding(new Log4JSLoggerBinding())
}
