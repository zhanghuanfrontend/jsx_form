const paths = require('./paths')
const webpack = require('webpack')
module.exports = {
    entry: {
        module: [
            'react', 
            'react-dom',
            'antd'
        ],
    },
    output: {
        filename: '[name].dll.js',
        path: paths.dll,
        library: '_dll_[name]'
    },
    plugins: [
        new webpack.DllPlugin({
            name: '_dll_[name]',
            path: paths.manifest
        })
    ]
}