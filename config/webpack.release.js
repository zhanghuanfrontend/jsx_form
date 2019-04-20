const webpackBase = require('./webpack.base')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
const UglifyJsPlugin = require("uglifyjs-webpack-plugin")
const paths = require('./paths')

module.exports = {
    ...webpackBase,
    plugins: [
        ...webpackBase.plugins,
        // 删除上次打包文件
        new CleanWebpackPlugin(),
        // new BundleAnalyzerPlugin(),
    ],
    optimization: {
        minimizer: [
            new UglifyJsPlugin({
                cache: true,
                sourceMap: true,
                parallel: true,
            }),
        ]
    },
    mode: 'production'
}