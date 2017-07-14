import "source-map-support/register";

import * as fs from "fs";
import * as path from "path";
import {
    LoggerBinding,
    LoggerImplementation,
} from "slf4ts-api";

import { WinstonLoggerImplementation } from "./WinstonLoggerImplementation";

/**
 * LoggerBinding implementation for Winston.
 *
 * @export
 * @class WinstonLoggerBinding
 * @implements {LoggerBinding}
 */
export class WinstonLoggerBinding implements LoggerBinding {

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
        return new WinstonLoggerImplementation();
    }

    public getVendor(): string {
        return "Winston";
    }

    public getVersion(): string {
        return this.packageJson.version;
    }

}
