const webpackBase = require('./webpack.base')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const HtmlWebpackIncludeAssetsPlugin = require('html-webpack-include-assets-plugin')
const webpack = require('webpack')
const paths = require('./paths')
const path = require('path')
module.exports = {
    ...webpackBase,
    plugins: [
        ...webpackBase.plugins,
        new webpack.DllReferencePlugin({
            manifest: require(path.join(__dirname, '../static/dll/module.manifest.json'))
        }),
        new CopyWebpackPlugin([
            {
                from: paths.static,
                to: path.join(__dirname, '../dist/static')
            }
        ]),
        new webpack.HotModuleReplacementPlugin(),
        new HtmlWebpackIncludeAssetsPlugin({
            assets: ['./static/dll/module.dll.js'],
            append: false,
        })
    ],
    devServer: {
        hot: true,
        hotOnly: true,
        contentBase: paths.output,
        port: 3012,
        proxy: paths.proxy,
        inline: true,
        host: '0.0.0.0'
    },
    devtool: 'source-map',
    mode: 'development',
    watch: true,
    watchOptions: {
        ignored: /node_modules/,
    }
}