import "source-map-support/register";

import { LoggerBindings } from "slf4ts-api";
import { ConsoleLoggerBinding } from "./ConsoleLoggerBinding";

/**
 * Instances a new {@link ConsoleLoggerBinding}
 *
 * @export
 * @param {LoggerBindings} registry The bindings collection to register with.
 */
module.exports = function(registry: LoggerBindings) {
    registry.registerBinding(new ConsoleLoggerBinding());
};
