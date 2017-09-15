// tslint:disable:no-unused-expression
import "source-map-support/register";

import * as chai from "chai";
import { Client } from "elasticsearch";
import { suite, test } from "mocha-typescript";
import { DefaultLoggerInstance, LoggerFactory, LogLevel } from "slf4ts-api";
import * as td from "testdouble";

import { ElasticsearchLogAdapter } from "../../lib/slf4ts/ElasticsearchLogAdapter";

const expect = chai.expect;

@suite
export class ElasticsearchLogAdapterTest {

    @test
    public checkClientLogging() {
        const logger = LoggerFactory.getLogger("elasticsearch") as DefaultLoggerInstance;
        const impl: any = logger.getImpl();
        impl.log = td.function();

        td.verify(impl.log(), { times: 0, ignoreExtraArgs: true });

        new Client({ log: new ElasticsearchLogAdapter().newLogger() });

        const explaination = td.explain(impl.log);
        const calls = explaination.calls;

        // level, group, name, message, metadata, logger-metadata
        expect(calls[0].args[0]).to.equal(LogLevel.INFO);
        expect(calls[0].args[3]).to.equal("Adding connection to");
        expect(calls[0].args[4]).to.equal("http://localhost:9200/");
        expect(calls[0].args[5]).to.not.exist;
    }

}
