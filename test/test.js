var ip = require('../index.js');

ip({
    ip: [
        '124.193.231.139',
        '124.42.244.108',
        "180.109.237.107"
    ]
}).then(res => {
    console.log(res);
}).then(() => ip({
    input: './input.json',
    output: './output.json'
})).then(() => ip({
    cwd: __dirname,
    input: './input.yml',
    format: 'yaml',
    output: './output.yml'
}));