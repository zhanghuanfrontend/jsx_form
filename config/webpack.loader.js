const paths = require('./paths')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
const path = require('path')

module.exports = {
    entry: {
        'loader': path.resolve(__dirname, '../loader/index.js'),
        'browser': path.resolve(__dirname, '../loader/browser.js')
    },
    output: {
        filename: '[name].min.js',
        path: paths.output,
        libraryTarget: 'commonjs2'
    },
    module: {
        rules: [
            {
                test: /\.(js)$/,
                include: paths.loaderPath,
                use: [
                    {
                        loader: 'babel-loader',
                        options: {
                            cacheDirectory: true,
                            presets: [
                                ['@babel/preset-env', {
                                    targets: {
                                        node: '8.0.0'
                                    }
                                }], 
                            ],
                        }
                    },
                ]
            }
        ]
    },
    plugins: [
        new BundleAnalyzerPlugin(),
    ],
    target: 'node',
    externals: {
        '@babel/core': {
            commonjs: '@babel/core',
            commonjs2: '@babel/core',
            root: '@babel/core',
            amd: '@babel/core'
        }
    },
    mode: 'production'
}