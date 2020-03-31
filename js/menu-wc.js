'use strict';


customElements.define('compodoc-menu', class extends HTMLElement {
    constructor() {
        super();
        this.isNormalMode = this.getAttribute('mode') === 'normal';
    }

    connectedCallback() {
        this.render(this.isNormalMode);
    }

    render(isNormalMode) {
        let tp = lithtml.html(`
        <nav>
            <ul class="list">
                <li class="title">
                    <a href="index.html" data-type="index-link">slf4ts documentation</a>
                </li>

                <li class="divider"></li>
                ${ isNormalMode ? `<div id="book-search-input" role="search"><input type="text" placeholder="Type to search"></div>` : '' }
                <li class="chapter">
                    <a data-type="chapter-link" href="index.html"><span class="icon ion-ios-home"></span>Getting started</a>
                    <ul class="links">
                        <li class="link">
                            <a href="overview.html" data-type="chapter-link">
                                <span class="icon ion-ios-keypad"></span>Overview
                            </a>
                        </li>
                        <li class="link">
                            <a href="index.html" data-type="chapter-link">
                                <span class="icon ion-ios-paper"></span>README
                            </a>
                        </li>
                        <li class="link">
                            <a href="license.html"  data-type="chapter-link">
                                <span class="icon ion-ios-paper"></span>LICENSE
                            </a>
                        </li>
                    </ul>
                </li>
                    <li class="chapter additional">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#additional-pages"'
                            : 'data-target="#xs-additional-pages"' }>
                            <span class="icon ion-ios-book"></span>
                            <span>Additional documentation</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="additional-pages"' : 'id="xs-additional-pages"' }>
                                    <li class="link ">
                                        <a href="additional-documentation/slf4ts-api.html" data-type="entity-link" data-context-id="additional">slf4ts-api</a>
                                    </li>
                                    <li class="link ">
                                        <a href="additional-documentation/slf4ts-bunyan.html" data-type="entity-link" data-context-id="additional">slf4ts-bunyan</a>
                                    </li>
                                    <li class="link ">
                                        <a href="additional-documentation/slf4ts-cassandra-log-adapter.html" data-type="entity-link" data-context-id="additional">slf4ts-cassandra-log-adapter</a>
                                    </li>
                                    <li class="link ">
                                        <a href="additional-documentation/slf4ts-console.html" data-type="entity-link" data-context-id="additional">slf4ts-console</a>
                                    </li>
                                    <li class="link ">
                                        <a href="additional-documentation/slf4ts-log4js.html" data-type="entity-link" data-context-id="additional">slf4ts-log4js</a>
                                    </li>
                                    <li class="link ">
                                        <a href="additional-documentation/slf4ts-loglevel.html" data-type="entity-link" data-context-id="additional">slf4ts-loglevel</a>
                                    </li>
                                    <li class="link ">
                                        <a href="additional-documentation/slf4ts-pino.html" data-type="entity-link" data-context-id="additional">slf4ts-pino</a>
                                    </li>
                                    <li class="link ">
                                        <a href="additional-documentation/slf4ts-winston.html" data-type="entity-link" data-context-id="additional">slf4ts-winston</a>
                                    </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#classes-links"' :
                            'data-target="#xs-classes-links"' }>
                            <span class="icon ion-ios-paper"></span>
                            <span>Classes</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="classes-links"' : 'id="xs-classes-links"' }>
                            <li class="link">
                                <a href="classes/BunyanLoggerBinding.html" data-type="entity-link">BunyanLoggerBinding</a>
                            </li>
                            <li class="link">
                                <a href="classes/BunyanLoggerImplementation.html" data-type="entity-link">BunyanLoggerImplementation</a>
                            </li>
                            <li class="link">
                                <a href="classes/CassandraLogAdapter.html" data-type="entity-link">CassandraLogAdapter</a>
                            </li>
                            <li class="link">
                                <a href="classes/ConsoleLoggerBinding.html" data-type="entity-link">ConsoleLoggerBinding</a>
                            </li>
                            <li class="link">
                                <a href="classes/ConsoleLoggerImplementation.html" data-type="entity-link">ConsoleLoggerImplementation</a>
                            </li>
                            <li class="link">
                                <a href="classes/DefaultLoggerInstance.html" data-type="entity-link">DefaultLoggerInstance</a>
                            </li>
                            <li class="link">
                                <a href="classes/Log4JSLoggerBinding.html" data-type="entity-link">Log4JSLoggerBinding</a>
                            </li>
                            <li class="link">
                                <a href="classes/Log4JSLoggerImplementation.html" data-type="entity-link">Log4JSLoggerImplementation</a>
                            </li>
                            <li class="link">
                                <a href="classes/LoggerBindings.html" data-type="entity-link">LoggerBindings</a>
                            </li>
                            <li class="link">
                                <a href="classes/LoggerConfigurationImpl.html" data-type="entity-link">LoggerConfigurationImpl</a>
                            </li>
                            <li class="link">
                                <a href="classes/LoggerFactory.html" data-type="entity-link">LoggerFactory</a>
                            </li>
                            <li class="link">
                                <a href="classes/LoglevelLoggerBinding.html" data-type="entity-link">LoglevelLoggerBinding</a>
                            </li>
                            <li class="link">
                                <a href="classes/LoglevelLoggerImplementation.html" data-type="entity-link">LoglevelLoggerImplementation</a>
                            </li>
                            <li class="link">
                                <a href="classes/NullLoggerImplementation.html" data-type="entity-link">NullLoggerImplementation</a>
                            </li>
                            <li class="link">
                                <a href="classes/PinoLoggerBinding.html" data-type="entity-link">PinoLoggerBinding</a>
                            </li>
                            <li class="link">
                                <a href="classes/PinoLoggerImplementation.html" data-type="entity-link">PinoLoggerImplementation</a>
                            </li>
                            <li class="link">
                                <a href="classes/WinstonLoggerBinding.html" data-type="entity-link">WinstonLoggerBinding</a>
                            </li>
                            <li class="link">
                                <a href="classes/WinstonLoggerImplementation.html" data-type="entity-link">WinstonLoggerImplementation</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#interfaces-links"' :
                            'data-target="#xs-interfaces-links"' }>
                            <span class="icon ion-md-information-circle-outline"></span>
                            <span>Interfaces</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? ' id="interfaces-links"' : 'id="xs-interfaces-links"' }>
                            <li class="link">
                                <a href="interfaces/ILoggerInstance.html" data-type="entity-link">ILoggerInstance</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/LoggerBinding.html" data-type="entity-link">LoggerBinding</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/LoggerImplementation.html" data-type="entity-link">LoggerImplementation</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#miscellaneous-links"'
                            : 'data-target="#xs-miscellaneous-links"' }>
                            <span class="icon ion-ios-cube"></span>
                            <span>Miscellaneous</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="miscellaneous-links"' : 'id="xs-miscellaneous-links"' }>
                            <li class="link">
                                <a href="miscellaneous/enumerations.html" data-type="entity-link">Enums</a>
                            </li>
                            <li class="link">
                                <a href="miscellaneous/typealiases.html" data-type="entity-link">Type aliases</a>
                            </li>
                            <li class="link">
                                <a href="miscellaneous/variables.html" data-type="entity-link">Variables</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <a data-type="chapter-link" href="coverage.html"><span class="icon ion-ios-stats"></span>Documentation coverage</a>
                    </li>
                    <li class="chapter">
                        <a data-type="chapter-link" href="unit-test.html"><span class="icon ion-ios-podium"></span>Unit test coverage</a>
                    </li>
                    <li class="divider"></li>
                    <li class="copyright">
                        Documentation generated using <a href="https://compodoc.app/" target="_blank">
                            <img data-src="images/compodoc-vectorise.png" class="img-responsive" data-type="compodoc-logo">
                        </a>
                    </li>
            </ul>
        </nav>
        `);
        this.innerHTML = tp.strings;
    }
});