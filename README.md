# slf4ts

Simple Logging Facade for NodeJS

<p align="center">
    <a href="https://travis-ci.org/rstiller/slf4ts">
        <img src="http://img.shields.io/travis/rstiller/slf4ts/master.svg" alt="Build Status">
    </a>
</p>

This is the mono-repository for the `slf4ts` modules.  
`slf4ts` modules are a collection of modules abstracting logging for nodejs libraries.  


Compatible libraries use the `slf4ts-api` module to get a Logger instance and do the logging.  
The application, that use these libraries, choose a concrete logging library alongside the  
corresponding `slf4ts` logger binding module to make their dependencies use the chosen logging library.

## Modules

| Module | Description | Status | Link |  |
| :--- | :--- | :--- | :--- | :--- |
| [slf4ts-api](packages/slf4ts-api) | API / interface module |  |  | ![NPM Version](https://img.shields.io/npm/v/slf4ts-api.svg) ![License](https://img.shields.io/npm/l/slf4ts-api.svg) ![Dependencies Status](https://img.shields.io/david/rstiller/slf4ts-api.svg) |
| <i>Bindings</i> |  |  |  |  |
| [slf4ts-bunyan](packages/slf4ts-bunyan) | Bunyan Logger Binding |  | [bunyan](https://github.com/trentm/node-bunyan#readme) | ![NPM Version](https://img.shields.io/npm/v/slf4ts-bunyan.svg) ![License](https://img.shields.io/npm/l/slf4ts-bunyan.svg) ![Dependencies Status](https://img.shields.io/david/rstiller/slf4ts-bunyan.svg) |
| [slf4ts-console](packages/slf4ts-console) | Console Logger Binding |  | [nodejs console](https://nodejs.org/api/console.html) | ![NPM Version](https://img.shields.io/npm/v/slf4ts-console.svg) ![License](https://img.shields.io/npm/l/slf4ts-console.svg) ![Dependencies Status](https://img.shields.io/david/rstiller/slf4ts-console.svg) |
| [slf4ts-log4js](packages/slf4ts-log4js) | log4js Logger Binding |  | [log4js](https://log4js-node.github.io/log4js-node/) | ![NPM Version](https://img.shields.io/npm/v/slf4ts-log4js.svg) ![License](https://img.shields.io/npm/l/slf4ts-log4js.svg) ![Dependencies Status](https://img.shields.io/david/rstiller/slf4ts-log4js.svg) |
| [slf4ts-loglevel](packages/slf4ts-loglevel) | loglevel Logger Binding |  | [loglevel](https://github.com/pimterry/loglevel) | ![NPM Version](https://img.shields.io/npm/v/slf4ts-loglevel.svg) ![License](https://img.shields.io/npm/l/slf4ts-loglevel.svg) ![Dependencies Status](https://img.shields.io/david/rstiller/slf4ts-loglevel.svg) |
| [slf4ts-pino](packages/slf4ts-pino) | pino Logger Binding |  | [pino](https://getpino.io/#/) | ![NPM Version](https://img.shields.io/npm/v/slf4ts-pino.svg) ![License](https://img.shields.io/npm/l/slf4ts-pino.svg) ![Dependencies Status](https://img.shields.io/david/rstiller/slf4ts-pino.svg) |
| [slf4ts-winston](packages/slf4ts-winston) | Winston Logger Binding |  | [winston](https://github.com/winstonjs/winston) | ![NPM Version](https://img.shields.io/npm/v/slf4ts-winston.svg) ![License](https://img.shields.io/npm/l/slf4ts-winston.svg) ![Dependencies Status](https://img.shields.io/david/rstiller/slf4ts-winston.svg) |
| <i>Adapter</i> |  |  |  |  |
| [slf4ts-cassandra-log-adapter](packages/slf4ts-cassandra-log-adapter) | Log adapter for cassandra nodejs client lib |  | [cassandra-driver](https://github.com/datastax/nodejs-driver) | ![NPM Version](https://img.shields.io/npm/v/slf4ts-cassandra-log-adapter.svg) ![License](https://img.shields.io/npm/l/slf4ts-cassandra-log-adapter.svg) ![Dependencies Status](https://img.shields.io/david/rstiller/slf4ts-cassandra-log-adapter.svg) |
| [slf4ts-elasticsearch-log-adapter](packages/slf4ts-elasticsearch-log-adapter) | Log adapter for elasticsearch nodejs client lib | <b>deprecated</b> | [elasticsearch](https://github.com/elastic/elasticsearch-js) | ![NPM Version](https://img.shields.io/npm/v/slf4ts-elasticsearch-log-adapter.svg) ![License](https://img.shields.io/npm/l/slf4ts-elasticsearch-log-adapter.svg) ![Dependencies Status](https://img.shields.io/david/rstiller/slf4ts-elasticsearch-log-adapter.svg) |

## Examples

Code examples for `javascript` and `typescript` are in the `examples` folder.  

# project development

init / update project (if a new dependency is introduced or an existing is updated):  

    npm i -g pnpm
    pnpm i

generate dependency report:  

    # run 'pnpm run build' before checking dependencies
    docker-compose run --rm deps

release packages / publish docs:  

    # check functionality
    pnpm i
    pnpm run build

    # public packages
    # change version in every dependent package
    pnpm i
    pnpm publish --filter slf4ts-api
    git add .
    git commit -m "publish version x.y.z of slf4ts-api"
    git tag slf4ts-api@x.y.z
    git push
    git push origin slf4ts-api@x.y.z

    # publish docs
    rm -fr docs/
    git branch -D gh-pages
    git worktree prune
    git worktree list
    git worktree add -b gh-pages docs origin/gh-pages
    pnpm run publishDocs

## License

[MIT](https://www.opensource.org/licenses/mit-license.php)
