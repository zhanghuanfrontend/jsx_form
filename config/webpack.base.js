const paths = require('./paths')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const webpack = require('webpack')
const devMode = process.env.NODE_ENV !== 'production'
const path = require('path')

module.exports = {
    entry: {
        index: paths.resolve('../src/index.js'),
        background: paths.resolve('../src/js/background.js')
    },
    output: {
        filename: 'js/[name].min.js',
        path: paths.output,
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                include: paths.srcPath,
                use: [
                    {
                        loader: 'babel-loader',
                        options: {
                            cacheDirectory: true,
                            presets: [
                                ['@babel/preset-env', {
                                    targets: {
                                        chrome: 62
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
    plugins: [
        new HtmlWebpackPlugin({
            template: paths.rootHtml,
            filename: 'index.html',
            inject: true,
            minify: {
                removeComments: true,
                collapseWhitespace: true,
                collapseInlineTagWhitespace: true,
            }
        })
    ],
    resolve: {
        alias: paths.alias,
        extensions: ['.js', '.jsx', '.css', '.less', '.json'],
        modules: [paths.module],
    },
    externals: {}
}