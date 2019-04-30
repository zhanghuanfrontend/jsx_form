const paths = require('./paths')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const webpack = require('webpack')
const devMode = process.env.NODE_ENV !== 'production'
const path = require('path')
const JSXFormLoader = require('../dist/loader.js')

const webpackPlugins = []
let externals = {}
if(devMode){
    webpackPlugins.push(new HtmlWebpackPlugin({
        template: paths.rootHtml,
        filename: 'index.html',
        inject: true,
        minify: {
            removeComments: true,
            collapseWhitespace: true,
            collapseInlineTagWhitespace: true,
        }
    }))
}else{
    externals = {
        'react': {
            commonjs: 'react',
            commonjs2: 'react',
            root: 'react',
            amd: 'react'
        }
    }
}
const fileName = devMode ? 'static/js/[name].[id].[hash].js' : 'index.min.js'
const entry = devMode ? paths.testEntry : paths.buildEntry

module.exports = {
    entry,
    output: {
        filename: fileName,
        path: paths.output,
        library: 'jsx-form',
        libraryTarget: 'umd'
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                include: [paths.testPath, paths.srcPath],
                use: [
                    {
                        loader: 'babel-loader',
                        options: {
                            cacheDirectory: true,
                            presets: [
                                ['@babel/preset-env', {
                                    targets: {
                                        browsers: ['ie >= 8']
                                    }
                                }], 
                                '@babel/preset-react'
                            ],
                            plugins: [
                                '@babel/plugin-transform-runtime',
                                ["@babel/plugin-proposal-decorators", { "legacy": true }],
                                ["@babel/plugin-proposal-class-properties", { "loose": true }]
                            ]
                        }
                    },
                    {
                        loader: path.resolve(__dirname, '../loader/index.js'),
                    }
                ]
            },
            {
                test: /\.(css|less)/,
                use: [
                    'style-loader',
                    'css-loader',
                    {
                        loader: 'postcss-loader',
                        options: {
                            plugins: [
                                require('postcss-cssnext')(),
                            ]
                        }
                    },
                    {
                        loader: 'less-loader',
                        options: {
                            javascriptEnabled: true
                        }
                    }
                ]
            },
        ]
    },
    plugins: webpackPlugins,
    resolve: {
        alias: paths.alias,
        extensions: ['.js', '.jsx', '.css', '.less', '.json'],
        modules: [paths.module],
    },
    externals,
}