# slf4ts

Simple Logging Facade for NodeJS

<p align="center">
    <a href="https://travis-ci.org/rstiller/slf4ts">
        <img src="http://img.shields.io/travis/rstiller/slf4ts/master.svg" alt="Build Status">
    </a>
</p>

This is the mono-repository for the `slf4ts` modules.  
`slf4ts` modules are a collection of modules abstracting logging for nodejs libraries.  

## Modules

| Module | Description | Status | Link |  |
| :--- | :--- | :--- | :--- | :--- |
| [slf4ts-api](packages/slf4ts-api) | API / interface module |  |  | ![NPM Version](https://img.shields.io/npm/v/slf4ts-api.svg) ![License](https://img.shields.io/npm/l/slf4ts-api.svg) ![Dependencies Status](https://img.shields.io/david/rstiller/slf4ts-api.svg) |
| [slf4ts-console](packages/slf4ts-console) | Console Logger Binding |  | [nodejs console](https://nodejs.org/api/console.html) | ![NPM Version](https://img.shields.io/npm/v/slf4ts-console.svg) ![License](https://img.shields.io/npm/l/slf4ts-console.svg) ![Dependencies Status](https://img.shields.io/david/rstiller/slf4ts-console.svg) |
| [slf4ts-winston](packages/slf4ts-winston) | Winston Logger Binding |  | [winston](https://github.com/winstonjs/winston) | ![NPM Version](https://img.shields.io/npm/v/slf4ts-winston.svg) ![License](https://img.shields.io/npm/l/slf4ts-winston.svg) ![Dependencies Status](https://img.shields.io/david/rstiller/slf4ts-winston.svg) |
| [slf4ts-cassandra-log-adapter](packages/slf4ts-cassandra-log-adapter) | Log adapter for cassandra nodejs client lib |  | [cassandra-driver](https://github.com/datastax/nodejs-driver) | ![NPM Version](https://img.shields.io/npm/v/slf4ts-cassandra-log-adapter.svg) ![License](https://img.shields.io/npm/l/slf4ts-cassandra-log-adapter.svg) ![Dependencies Status](https://img.shields.io/david/rstiller/slf4ts-cassandra-log-adapter.svg) |
| [slf4ts-elasticsearch-log-adapter](packages/slf4ts-elasticsearch-log-adapter) | Log adapter for elasticsearch nodejs client lib | <b>deprecated</b> | [elasticsearch](https://github.com/elastic/elasticsearch-js) | ![NPM Version](https://img.shields.io/npm/v/slf4ts-elasticsearch-log-adapter.svg) ![License](https://img.shields.io/npm/l/slf4ts-elasticsearch-log-adapter.svg) ![Dependencies Status](https://img.shields.io/david/rstiller/slf4ts-elasticsearch-log-adapter.svg) |

## License

[MIT](https://www.opensource.org/licenses/mit-license.php)
