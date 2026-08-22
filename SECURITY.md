# Security Policy

## Supported Versions

The latest published version of each `slf4ts-*` package on npm is supported
with security updates.

| Package                          | Supported |
| :------------------------------- | :-------- |
| slf4ts-api                       | >= 1.4    |
| slf4ts-console                   | >= 1.3    |
| slf4ts-bunyan                    | >= 1.0    |
| slf4ts-log4js                    | >= 1.1    |
| slf4ts-loglevel                  | >= 1.0    |
| slf4ts-pino                      | >= 1.0    |
| slf4ts-winston                   | >= 1.3    |
| slf4ts-cassandra-log-adapter     | >= 1.2    |

Older versions do not receive security updates. Please upgrade to the latest
release of the affected package.

## Reporting a Vulnerability

Please do **not** report security vulnerabilities through public GitHub
issues, discussions, or pull requests.

Use [GitHub's private vulnerability reporting](https://github.com/rstiller/slf4ts/security/advisories/new)
to submit a report. Include as much of the following information as possible:

- the affected package(s) and version(s)
- a description of the vulnerability and its impact
- step-by-step instructions or a proof-of-concept to reproduce the issue

You can expect an initial response within a few days. Once a fix is available,
it will be released and the advisory will be published.

## Known Non-Issues

This project is a logging facade; log output may contain whatever data the
application passes to it. Calls logging sensitive data at inappropriate
log-levels are application bugs, not vulnerabilities of `slf4ts` itself.
