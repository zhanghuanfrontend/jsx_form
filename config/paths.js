const path = require('path')

const resolve = url => path.resolve(__dirname, url)

const proxy = {
    // '*': 'http://10.8.126.56:8400',
    '*': 'http://10.224.5.102'
}

module.exports = {
    testEntry: resolve('../example/index.js'),
    buildEntry: resolve('../src/index.js'),
    output: resolve('../dist'),
    srcPath: resolve('../src'),
    testPath: resolve('../example'),
    rootHtml: resolve('../public/index.html'),
    module: resolve('../node_modules'),
    static: resolve('../static'),
    dll: resolve('../static/dll'),
    manifest: resolve('../static/dll/[name].manifest.json'),
    manifestPath: resolve('../static/dll/module.manifest.json'),
    alias: {
        // 'react': 'preact-compat',
        // 'react-dom': 'preact-compat',
        // '@': path.resolve(__dirname, '../src/components'),
        // 'tmp': path.resolve(__dirname, '../src/templates'),
        // 'utils': path.resolve(__dirname, '../src/utils'),
        // 'com': path.resolve(__dirname, '../src/common'),
        // 'apis': path.resolve(__dirname, '../src/apis'),
        // 'actions': path.resolve(__dirname, '../src/redux/actions'),
    },
    proxy,
}