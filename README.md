# ip-info

[![Build Status](https://travis-ci.org/poppinlp/ip-info.png?branch=master)](https://travis-ci.org/poppinlp/ip-info)
[![Dependency Status](https://david-dm.org/poppinlp/ip-info.svg)](https://david-dm.org/poppinlp/ip-info)
[![devDependency Status](https://david-dm.org/poppinlp/ip-info/dev-status.svg)](https://david-dm.org/poppinlp/ip-infp#info=devDependencies)

Get IP information include country, province, city and operator.

## Getting Started

Install with this command:

```shell
npm i ip-info --save
```

Or maybe you like yarn:

```shell
yarn add ip-info
```

## How to use

You should import this module first:

```js
var ip = require('ip-info');
```

The `ip` above is a function which accepts a config object and returns a promise.
The only thing you should do is passing a config object and have fun!

### Config

#### ipReg {String} [OPTION]

Default: `^(?:\d{1,3}\.){3}\d{1,3}$`

This string will be used as RegExp to test every ip.

#### ip {String | Array}

The target ip or ip list. You must supply one of `ip` or `input`.

#### input {String}

The file path for target ip list. You must supply one of `ip` or `input`.

#### output {String} [OPTION]

The file path for output.

#### cwd {String} [OPTION]

Default: the directory of file which use this module

This path will be used to join with `input` and `output` path.

#### format {String} [OPTION]

Default: `json`

The format for input and output file. Only support `json` and `yaml` now. Welcome PR >.<

#### encoding {String} [OPTION]

Default: `utf8`

The encoding for input and output file.

#### service {String} [OPTION]

Default: `ipip.net`

The ip search service. Only support `ipip.net` now. Welcome PR >.<

#### interval {Number} [OPTION]

Default: `300`

The time interval between each request to prevent ban.

## Sample

### Basic

```js
var ip = require('ip-info');

ip({
    ip: '8.8.8.8'
}).then(res => {
    // deal with result
}).catch(err => {
    // deal with error
});
```

### More config

```js
var ip = require('ip-info');

ip({
    cwd: 'relative/path/',
    input: 'path/to/input.yml',
    format: 'yaml',
    output: 'path/to/output.yml',
    interval: '500'
});
```

## Test

```shell
npm test
```

## TODO

- Support service account
- Add more service such as ipinfo.io, ip.taobao.com

## History

- 0.0.1
    - init
