import "source-map-support/register";

import * as fs from "fs";
import * as path from "path";

import { LogLevel } from "./LoggerConfiguration";

/**
 * The bidge to the underlying logging-framework.
 *
 * @export
 * @interface LoggerImplementation
 */
export interface LoggerImplementation {

    /**
     * Invoked for each call to a logging method of a logger instance.
     *
     * @param {LogLevel} level The log level of the logging method.
     * @param {string} group The group of the logger instance.
     * @param {string} name The name of the logger instance.
     * @param {string} message The message the logging method was called with.
     * @param {(Error | null | undefined)} error A possible Error to log.
     * @param {(any | null | undefined)} metadata A metadata object to give the log statment a context.
     * @returns {Promise<any>} A Promise completed when the log statement was processed by the underlying logging-framework.
     * @memberof LoggerImplementation
     */
    log(level: LogLevel, group: string, name: string, message: string, error: Error | null | undefined, metadata: any | null | undefined): Promise<any>;

    /**
     * Gets the underlying implementation of the logger.
     *
     * @template T Type of logger instance.
     * @param {string} group The group of the logger.
     * @param {string} name The name of the logger.
     * @memberof LoggerImplementation
     */
    getImplementation<T>(group: string, name: string): T;

    /**
     * Sets the configuration for the specified logger instance.
     *
     * @template T Type of config object
     * @param {T} config The implementation-specific configuration.
     * @param {string} group The group of the logger.
     * @param {string} name The name of the logger.
     * @memberof LoggerImplementation
     */
    setConfig<T>(config: T, group: string, name: string): void;

}

/**
 * A metadata object for a binding.
 *
 * @export
 * @interface LoggerBinding
 */
export interface LoggerBinding {
    /**
     * Gets the logger implementation.
     *
     * @returns {LoggerImplementation} The logger implementation.
     * @memberof LoggerBinding
     */
    getLoggerImplementation(): LoggerImplementation;
    /**
     * Gets the vendor string.
     *
     * @returns {string} The vendor name.
     * @memberof LoggerBinding
     */
    getVendor(): string;
    /**
     * Gets the version string.
     *
     * @returns {string} The version number.
     * @memberof LoggerBinding
     */
    getVersion(): string;
}

/**
 * Encapsulates the loading of logger bindings from NODE_PATH.
 *
 * Additionally the location of other logging-framwork bindings can
 * be configured using the environemnt variable 'LOGGER_BINDING_ADDITIONAL_PATH'.
 *
 * For each folder - containing a file named '.slf4ts-binding' in 'NODE_PATH',
 * 'LOGGER_BINDING_ADDITIONAL_PATH' or the additional search paths given to
 * LoggerBindings - LoggerBindings loads the node-module and invokes the function
 * that is the default export of the entire module for registration.
 *
 * @export
 * @class LoggerBindings
 */
export class LoggerBindings {

    /**
     * Array of loaded bindings.
     *
     * @private
     * @type {LoggerBinding[]}
     * @memberof LoggerBindings
     */
    private bindings: LoggerBinding[] = [];

    /**
     * Creates an instance of LoggerBindings.
     *
     * @param {string[]} [additionalPaths=[]] A string array with additional paths to search bindings.
     * @memberof LoggerBindings
     */
    public constructor(additionalPaths: string[] = []) {
        if (process.env.LOGGER_BINDING_ADDITIONAL_PATH) {
            additionalPaths.push(process.env.LOGGER_BINDING_ADDITIONAL_PATH);
        }

        const moduleFolders: string[] = this.getAllModuleFolders(additionalPaths);
        const loggerBindings: string[] = this.getAllLoggerBindings(moduleFolders);

        loggerBindings.forEach((binding) => {
            const registerFunc = require(binding);
            registerFunc(this);
        });
    }

    /**
     * Used to register a logging-framework binding.
     *
     * @param {LoggerBinding} binding The LoggerBinding to register.
     * @returns
     * @memberof LoggerBindings
     */
    public registerBinding(binding: LoggerBinding) {
        const exists = this.bindings.filter((b) => {
            const vendorEquals = b.getVendor() === binding.getVendor();
            const versionEquals = b.getVersion() === binding.getVersion();
            return vendorEquals && versionEquals;
        }).length > 0;

        if (exists) {
            return;
        }

        this.bindings.push(binding);
    }

    /**
     * Gets a copy of all {@link LoggerBinding}
     *
     * @returns {LoggerBinding[]}
     * @memberof LoggerBindings
     */
    public getBindings(): LoggerBinding[] {
        return [].concat(this.bindings);
    }

    private getAllModuleFolders(additionalPaths: string[]): string[] {
        const rootPaths: string[] = (module as any).paths;
        const moduleFolders: string[] = [];

        rootPaths.concat(additionalPaths).forEach((rootPath) =>
            this.visitNodeModules(rootPath).forEach((folder) => moduleFolders.push(folder)));

        return moduleFolders;
    }

    private visitNodeModules(rootPath: string) {
        const moduleFolders: string[] = [];

        if (fs.existsSync(rootPath)) {
            const files = fs.readdirSync(rootPath);
            files.forEach((folder) => {
                const absolutePath = path.join(rootPath, folder);
                moduleFolders.push(absolutePath);
                this.visitNodeModules(path.join(absolutePath, "node_modules"))
                    .forEach((subfolder) => moduleFolders.push(subfolder));
            });
        }

        return moduleFolders;
    }

    private getAllLoggerBindings(moduleFolders: string[]): string[] {
        const bindings: string[] = [];

        moduleFolders.forEach((moduleFolder) => {
            if (fs.existsSync(path.join(moduleFolder, ".slf4ts-binding"))) {
                bindings.push(path.basename(moduleFolder));
            }
        });

        return bindings;
    }

}
