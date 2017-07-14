import "source-map-support/register";

import { LoggerBindings } from "slf4ts-api";
import { WinstonLoggerBinding } from "./WinstonLoggerBinding";

/**
 * Instances a new {@link WinstonLoggerBinding}
 *
 * @export
 * @param {LoggerBindings} registry The bindings collection to register with.
 */
module.exports = function(registry: LoggerBindings) {
    registry.registerBinding(new WinstonLoggerBinding());
};
