import 'source-map-support/register'

import { type LoggerBindings } from 'slf4ts-api'
import { BunyanLoggerBinding } from './BunyanLoggerBinding'

/**
 * Instances a new {@link BunyanLoggerBinding}
 *
 * @export
 * @param {LoggerBindings} registry The bindings collection to register with.
 */
module.exports = function (registry: LoggerBindings) {
  registry.registerBinding(new BunyanLoggerBinding())
}
