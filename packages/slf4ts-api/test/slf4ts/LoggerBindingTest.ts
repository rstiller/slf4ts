// tslint:disable:no-unused-expression
import "source-map-support/register";

import * as chai from "chai";
import { suite, test } from "mocha-typescript";
import * as path from "path";

const expect = chai.expect;

// hack to re-initialize the path for module resolution
const nodeModuleExtraPath = path.join(__dirname, "..", "..", "example-node-modules");
process.env.NODE_PATH = nodeModuleExtraPath;
require("module").Module._initPaths();

import { LoggerBindings } from "../../lib/slf4ts/LoggerBindings";

@suite
export class LoggerBindingsTest {

    @test
    public checkLoadingOfBinding(): void {
        const bindings = new LoggerBindings([nodeModuleExtraPath]).getBindings();

        // should contain the example logger binding from 'example-node-modules'
        expect(bindings).to.have.length(1);
        expect(bindings[0].getVendor()).to.equal("Node.Console");
        expect(bindings[0].getVersion()).to.equal("1.0.0");
    }

}
