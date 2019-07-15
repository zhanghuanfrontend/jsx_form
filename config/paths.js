const path = require('path')

const resolve = url => path.resolve(__dirname, url)
const proxy = {
    '/et_api': 'http://10.8.122.68:9099'
}

module.exports = {
    buildEntry: resolve('../src/index.js'),
    output: resolve('../dist'),
    srcPath: resolve('../src'),
    rootHtml: resolve('../public/index.html'),
    module: resolve('../node_modules'),
    static: resolve('../static'),
    dll: resolve('../static/dll'),
    manifest: resolve('../static/dll/[name].manifest.json'),
    manifestPath: resolve('../static/dll/module.manifest.json'),
    resolve,
    alias: {
        // 'react': 'preact-compat',
        // 'react-dom': 'preact-compat',
        // '@': path.resolve(__dirname, '../src/components'),
        // 'tmp': path.resolve(__dirname, '../src/templates'),
        // 'utils': path.resolve(__dirname, '../src/utils'),
        'dist': path.resolve(__dirname, '../dist'),
        'src': path.resolve(__dirname, '../src'),
        'apis': path.resolve(__dirname, '../src/apis'),
        // 'apis': path.resolve(__dirname, '../src/apis'),
        // 'actions': path.resolve(__dirname, '../src/redux/actions'),
    },
    proxy,
}