import * as fs from "fs";
import * as path from "path";

import { LogLevel } from "./LoggerConfiguration";

export interface LoggerImplementation {
    log(level: LogLevel, message: string, ...metadata: any[]): Promise<any>;
}

export interface LoggerBinding {
    getLoggerImplementation(): LoggerImplementation;
    getVendor(): string;
    getVersion(): string;
}

export class LoggerBindings {

    private bindings: LoggerBinding[] = [];

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
