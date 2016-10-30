const
    request = require('request'),
    _ = require('lodash'),
    yaml = require('js-yaml'),
    fs = require('fs'),
    path = require('path'),
    cache = {};

const getInfo = ip => new Promise((resolve, reject) => {
    if (cache[ip]) {
        resolve(cache[ip]);
        return;
    }

    request({
        url: `http://freeapi.ipip.net/${ip}`,
        headers: {
            'Accept': 'text/html;q=0.9,image/webp,*/*;q=0.8',
            'Accept-Encoding': 'gzip, deflate, sdch',
            'Accept-Language': 'en,zh-CN;q=0.8,zh;q=0.6',
            'Upgrade-Insecure-Requests': 1,
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/54.0.2840.59 Safari/537.36'
        },
        method: 'get'
    }, (err, res, body) => {
        if (!err && res.statusCode == 200) {
            body = JSON.parse(body);

            cache[ip] = {
                ip: ip,
                country: body[0],
                province: body[1],
                city: body[2],
                operator: body[4]
            };

            resolve(cache[ip]);
        } else {
            reject(`Get ${ip} info failed: ${err}`)
        }
    });
});

const getServiceFun = service => ({
    'ipip.net': getInfo
})[service];

const delay = t => new Promise(resolve => setTimeout(resolve, t));

const getListInfo = ({ list, interval, service, ipReg }) => new Promise((resolve, reject) => {
    var res = [],
        fun = getServiceFun(service),
        f = () => {
            if (!list.length) {
                resolve(res);
                return;
            }

            let ip = list.pop();
            ipReg

            getInfo(ip)
                .then(info => res.unshift(info))
                .then(() => delay(interval))
                .then(f)
                .catch(reject);
        };

    f();
});

const outputCache = path => fs.writeFileSync(path, JSON.stringify(cache), {
    encoding: 'utf8'
});

const defaultConfig = {
    format: 'json',
    encoding: 'utf8',
    service: 'ipip.net',
    interval: 300,
    ipReg: '^(?:\d{1,3}\.){3}\d{1,3}$',
    cwd: path.dirname(process.mainModule.filename)
};

/*
 * ipReg {String}
 * ip {String | Array}
 * cwd {String}
 * input {String}
 * output {String}
 * format {String}
 * encoding {String}
 * service {String}
 * interval {Number}
 */
module.exports = config => new Promise((resolve, reject) => {
    config = _.extend(defaultConfig, config);

    if (!config.ip && !config.input) throw 'No ip or input param found!';

    var target = _.isArray(config.ip) ? config.ip : [ config.ip ],
        ipReg;

    try {
        ipReg = new RegExp(config.ipReg);
    } catch (e) {
        throw `Create RegExp error: ${e}`;
    }

    if (config.input) {
        ({
            json: txt => {
                try {
                    target = JSON.parse(txt);
                } catch (e) {
                    throw `Parse JSON input file error: ${e}`;
                }
            },
            yaml: txt => {
                try {
                    target = yaml.safeLoad(txt);
                } catch (e) {
                    throw `Parse YAML input file error: ${e}`;
                }
            }
        })[config.format](fs.readFileSync(path.join(config.cwd, config.input), {
            encoding: config.encoding
        }));
    }

    getListInfo({
        list: target,
        interval: config.interval,
        service: config.service,
        ipReg: ipReg
    }).then(res => {
        if (config.output) {
            fs.writeFileSync(path.join(config.cwd, config.output), ({
                json: () => JSON.stringify(res),
                yaml: () => yaml.safeDump(res)
            })[config.format](), {
                encoding: config.encoding
            });
        }

        resolve(res);
    }).catch(reject);
});
