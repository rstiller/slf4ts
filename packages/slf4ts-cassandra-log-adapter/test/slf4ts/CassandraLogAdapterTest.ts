// tslint:disable:no-unused-expression
import "source-map-support/register";

import { Client } from "cassandra-driver";
import * as chai from "chai";
import * as chaiString from "chai-string";
import { EventEmitter } from "events";
import { suite, test } from "mocha-typescript";
import { DefaultLoggerInstance, LoggerFactory, LogLevel } from "slf4ts-api";
import * as td from "testdouble";

import { CassandraLogAdapter } from "../../lib/slf4ts/CassandraLogAdapter";

chai.use(chaiString);
const expect = chai.expect;

@suite
export class CassandraLogAdapterTest {

    @test
    public checkLogEventHandlingWithEventEmitter() {
        const emitter = new EventEmitter();
        const logger = LoggerFactory.getLogger("cassandra") as DefaultLoggerInstance;
        const impl: any = logger.getImpl();
        impl.log = td.function();

        new CassandraLogAdapter(emitter);

        td.verify(impl.log(), { times: 0, ignoreExtraArgs: true });

        emitter.emit("log", "info", "java.x.y.z", "message from cassandra", null);

        td.verify(impl.log(), { times: 1, ignoreExtraArgs: true });
    }

    @test
    public checkLogEventHandlingWithClientNoKeyspace() {
        const client = new Client({ contactPoints: ["127.0.0.1:65535"] });
        const logger = LoggerFactory.getLogger("cassandra") as DefaultLoggerInstance;
        const impl: any = logger.getImpl();
        impl.log = td.function();

        new CassandraLogAdapter(client);

        td.verify(impl.log(), { times: 0, ignoreExtraArgs: true });

        client.emit("log", "info", "java.x.y.z", "message from cassandra", null);

        td.verify(impl.log(), { times: 1, ignoreExtraArgs: true });
    }

    @test
    public checkLogEventHandlingWithClientAndKeyspace() {
        const client = new Client({ contactPoints: ["127.0.0.1:65535"], keyspace: "test_space" });
        const logger = LoggerFactory.getLogger("cassandra", "test_space") as DefaultLoggerInstance;
        const impl: any = logger.getImpl();
        impl.log = td.function();

        new CassandraLogAdapter(client);

        td.verify(impl.log(), { times: 0, ignoreExtraArgs: true });

        client.emit("log", "info", "java.x.y.z", "message from cassandra", null);

        td.verify(impl.log(), { times: 1, ignoreExtraArgs: true });
    }

    @test
    public checkLogLevelMapping() {
        const emitter = new EventEmitter();
        const logger = LoggerFactory.getLogger("cassandra") as DefaultLoggerInstance;
        const impl: any = logger.getImpl();
        impl.log = td.function();

        new CassandraLogAdapter(emitter);

        logger.setLogLevel(LogLevel.DEBUG);

        emitter.emit("log", "verbose", "java.x.y.z", "message from cassandra", null);
        td.verify(impl.log(LogLevel.DEBUG), { times: 1, ignoreExtraArgs: true });

        emitter.emit("log", "info", "java.x.y.z", "message from cassandra", null);
        td.verify(impl.log(LogLevel.INFO), { times: 1, ignoreExtraArgs: true });

        emitter.emit("log", "warning", "java.x.y.z", "message from cassandra", null);
        td.verify(impl.log(LogLevel.WARN), { times: 1, ignoreExtraArgs: true });

        emitter.emit("log", "error", "java.x.y.z", "message from cassandra", null);
        td.verify(impl.log(LogLevel.ERROR), { times: 1, ignoreExtraArgs: true });
    }

    @test
    public checkClientConnect(done: (err?: any) => any) {
        const client = new Client({ contactPoints: ["127.0.0.1:65535"] });
        const logger = LoggerFactory.getLogger("cassandra") as DefaultLoggerInstance;
        const impl: any = logger.getImpl();
        impl.log = td.function();

        new CassandraLogAdapter(client);

        logger.setLogLevel(LogLevel.DEBUG);

        client.connect(() => {
            const explanation = td.explain(impl.log);
            const calls = explanation.calls;
            expect(calls.length).to.equal(5);

            // level, group, name, className, message, furtherInformation, logger-metadata
            expect(calls[0].args[0]).to.equal(LogLevel.INFO);
            expect(calls[0].args[3]).to.startWith("Client - Connecting to cluster using " +
                                                "'DataStax Node.js Driver for Apache Cassandra' version");
            expect(calls[0].args[4]).to.not.exist;

            expect(calls[1].args[0]).to.equal(LogLevel.INFO);
            expect(calls[1].args[3]).to.equal("ControlConnection - Getting first connection");
            expect(calls[1].args[4]).to.not.exist;

            expect(calls[2].args[0]).to.equal(LogLevel.INFO);
            expect(calls[2].args[3]).to.equal("Connection - Connecting to 127.0.0.1:65535");
            expect(calls[2].args[4]).to.not.exist;

            expect(calls[3].args[0]).to.equal(LogLevel.WARN);
            expect(calls[3].args[3]).to.equal("Connection - There was an error when trying" +
                                                " to connect to the host 127.0.0.1:65535");
            expect(calls[3].args[4]).to.contain({
                address: "127.0.0.1",
                code: "ECONNREFUSED",
                errno: "ECONNREFUSED",
                port: 65535,
                syscall: "connect",
            });

            expect(calls[4].args[0]).to.equal(LogLevel.ERROR);
            expect(calls[4].args[3]).to.equal("ControlConnection - ControlConnection failed to acquire a connection");
            expect(calls[4].args[4]).to.contain({
                info: "Represents an error when a query cannot be performed " +
                        "because no host is available or could be reached by the driver.",
            });

            done();
        });
    }

}
