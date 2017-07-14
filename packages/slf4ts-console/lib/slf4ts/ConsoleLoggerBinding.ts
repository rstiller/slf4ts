import "source-map-support/register";

import * as fs from "fs";
import * as path from "path";
import {
    LoggerBinding,
    LoggerImplementation,
} from "slf4ts-api";

import { ConsoleLoggerImplementation } from "./ConsoleLoggerImplementation";

/**
 * A simple LoggerBinding implementation for Node.Console.
 *
 * @export
 * @class ConsoleLoggerBinding
 * @implements {LoggerBinding}
 */
export class ConsoleLoggerBinding implements LoggerBinding {

    private packageJson: any;

    public constructor() {
        const modulePath = path.parse(module.filename);
        let currentDir = path.resolve(modulePath.dir);
        while (true) {
            currentDir = path.resolve(path.join(currentDir, ".."));
            const packageJsonPath = path.resolve(path.join(currentDir, "package.json"));
            if (fs.existsSync(packageJsonPath)) {
                this.packageJson = require(packageJsonPath);
                break;
            }
        }
    }

    public getLoggerImplementation(): LoggerImplementation {
        return new ConsoleLoggerImplementation();
    }

    public getVendor(): string {
        return "Node.Console";
    }

    public getVersion(): string {
        return this.packageJson.version;
    }

}
