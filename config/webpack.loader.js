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
        },
        'react': {
            commonjs: 'react',
            commonjs2: 'react',
            root: 'react',
            amd: 'react'
        },
        'react_jsx_form': {
            commonjs: 'react_jsx_form',
            commonjs2: 'react_jsx_form',
            root: 'react_jsx_form',
            amd: 'react_jsx_form'
        }
    },
    mode: 'production'
}