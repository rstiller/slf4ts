// tslint:disable:no-unused-expression
import "source-map-support/register";

import * as chai from "chai";
import { suite, test } from "mocha-typescript";
import { LogLevel } from "slf4ts-api";
import * as td from "testdouble";

import { ConsoleLoggerImplementation } from "../../lib/slf4ts/ConsoleLoggerImplementation";

const expect = chai.expect;

class TestConsole implements Console {

    memory: any;
    
    public markTimeline(label?: string): void {
        throw new Error("Method not implemented.");
    }
    
    public timeStamp(label?: string): void;
    
    public timeStamp(label?: string): void;
    
    public timeStamp(label?: any) {
        throw new Error("Method not implemented.");
    }

    public timeline(label?: string): void {
        throw new Error("Method not implemented.");
    }
    
    public timelineEnd(label?: string): void {
        throw new Error("Method not implemented.");
    }

    public countReset(label?: string): void {
        throw new Error("Method not implemented.");
    }

    public Console: NodeJS.ConsoleConstructor;

    public assert(value?: any, message?: any, ...optionalParams: any[]) {
        throw new Error("Method not implemented.");
    }
    public clear(): void {
        throw new Error("Method not implemented.");
    }
    public count(countTitle?: string): void {
        throw new Error("Method not implemented.");
    }
    public debug(message?: any, ...optionalParams: any[]): void {
        throw new Error("Method not implemented.");
    }
    public dir(value?: any, ...optionalParams: any[]): void;
    // tslint:disable:no-unused-expression
    public dir(obj: any, options?: NodeJS.InspectOptions): void;
    // tslint:disable:no-unused-expression
    public dir(obj?: any, options?: any, ...rest: any[]) {
        throw new Error("Method not implemented.");
    }
    public dirxml(value: any): void {
        throw new Error("Method not implemented.");
    }
    public error(message?: any, ...optionalParams: any[]): void;
    // tslint:disable:no-unused-expression
    public error(message?: any, ...optionalParams: any[]): void;
    // tslint:disable:no-unused-expression
    public error(message?: any, ...optionalParams: any[]) {
        throw new Error("Method not implemented.");
    }
    public exception(message?: string, ...optionalParams: any[]): void {
        throw new Error("Method not implemented.");
    }
    public group(groupTitle?: string, ...optionalParams: any[]): void {
        throw new Error("Method not implemented.");
    }
    public groupCollapsed(groupTitle?: string, ...optionalParams: any[]): void {
        throw new Error("Method not implemented.");
    }
    public groupEnd(): void {
        throw new Error("Method not implemented.");
    }
    public info(message?: any, ...optionalParams: any[]): void;
    // tslint:disable:no-unused-expression
    public info(message?: any, ...optionalParams: any[]): void;
    // tslint:disable:no-unused-expression
    public info(message?: any, ...optionalParams: any[]) {
        throw new Error("Method not implemented.");
    }
    public log(message?: any, ...optionalParams: any[]): void;
    // tslint:disable:no-unused-expression
    public log(message?: any, ...optionalParams: any[]): void;
    // tslint:disable:no-unused-expression
    public log(message?: any, ...optionalParams: any[]) {
        throw new Error("Method not implemented.");
    }
    public msIsIndependentlyComposed(element: Element): boolean {
        throw new Error("Method not implemented.");
    }
    public profile(reportName?: string): void {
        throw new Error("Method not implemented.");
    }
    public profileEnd(): void {
        throw new Error("Method not implemented.");
    }
    public select(element: Element): void {
        throw new Error("Method not implemented.");
    }
    public table(...data: any[]): void {
        throw new Error("Method not implemented.");
    }
    public time(timerName?: string): void;
    // tslint:disable:no-unused-expression
    public time(label: string): void;
    // tslint:disable:no-unused-expression
    public time(label?: any) {
        throw new Error("Method not implemented.");
    }
    public timeEnd(timerName?: string): void;
    // tslint:disable:no-unused-expression
    public timeEnd(label: string): void;
    // tslint:disable:no-unused-expression
    public timeEnd(label?: any) {
        throw new Error("Method not implemented.");
    }
    public trace(message?: any, ...optionalParams: any[]): void;
    // tslint:disable:no-unused-expression
    public trace(message?: any, ...optionalParams: any[]): void;
    // tslint:disable:no-unused-expression
    public trace(message?: any, ...optionalParams: any[]) {
        throw new Error("Method not implemented.");
    }
    public warn(message?: any, ...optionalParams: any[]): void;
    // tslint:disable:no-unused-expression
    public warn(message?: any, ...optionalParams: any[]): void;
    // tslint:disable:no-unused-expression
    public warn(message?: any, ...optionalParams: any[]) {
        throw new Error("Method not implemented.");
    }
}

@suite
export class ConsoleLoggerImplementationTest {

    public after() {
        td.reset();
    }

    @test
    public async checkArgumentPassing() {
        const c: Console = new TestConsole();
        const consoleMock = td.object(c);
        const logger = new ConsoleLoggerImplementation(consoleMock);

        expect(td.explain(consoleMock.error).callCount).to.equal(0);
        expect(td.explain(consoleMock.info).callCount).to.equal(0);
        expect(td.explain(consoleMock.log).callCount).to.equal(0);
        expect(td.explain(consoleMock.trace).callCount).to.equal(0);
        expect(td.explain(consoleMock.warn).callCount).to.equal(0);

        await logger.log(LogLevel.INFO, "", "", "Test Message 1");
        td.verify(consoleMock.info(td.matchers.isA(String), "ROOT", "INFO", "Test Message 1"), { ignoreExtraArgs: false, times: 1 });

        await logger.log(LogLevel.DEBUG, "group1", "", "Test Message 2");
        td.verify(consoleMock.log(td.matchers.isA(String), "group1", "DEBUG", "Test Message 2"), { ignoreExtraArgs: false, times: 1 });

        await logger.log(LogLevel.TRACE, "", "name1", "Test Message 3");
        td.verify(consoleMock.trace(td.matchers.isA(String), "name1", "TRACE", "Test Message 3"), { ignoreExtraArgs: false, times: 1 });

        await logger.log(LogLevel.WARN, "group2", "name2", "Test Message 4");
        td.verify(consoleMock.warn(td.matchers.isA(String), "group2.name2", "WARN", "Test Message 4"), { ignoreExtraArgs: false, times: 1 });

        const metadata = { application: "my-app", version: "1.0.0" };
        await logger.log(LogLevel.ERROR, "", "", "Test Message 5", metadata);
        td.verify(consoleMock.error(td.matchers.isA(String), "ROOT", "ERROR", "Test Message 5", metadata), { ignoreExtraArgs: false, times: 1 });

        const error = new Error();
        await logger.log(LogLevel.INFO, "", "", "Test Message 6", error, metadata);
        td.verify(consoleMock.info(td.matchers.isA(String), "ROOT", "INFO", "Test Message 6", error, metadata), { ignoreExtraArgs: false, times: 1 });

        await logger.log(LogLevel.DEBUG, "", "", "Test Message 7", error);
        td.verify(consoleMock.log(td.matchers.isA(String), "ROOT", "DEBUG", "Test Message 7", error), { ignoreExtraArgs: false, times: 1 });

        await logger.log(6, "", "", "Test Message 8");
        td.verify(consoleMock.log(td.matchers.isA(String), "ROOT", "", "Test Message 8"), { ignoreExtraArgs: false, times: 1 });
    }

    @test
    public async checkGetImplementation() {
        const c: Console = new TestConsole();
        const consoleMock = td.object(c);
        const logger = new ConsoleLoggerImplementation(consoleMock);

        expect(logger.getImplementation("", "")).to.equal(consoleMock);
    }

}
