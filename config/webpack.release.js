const webpackBase = require('./webpack.base')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
const UglifyJsPlugin = require("uglifyjs-webpack-plugin")
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin")
const paths = require('./paths')
// const PurifyCSS = require('purifycss-webpack')
// const glob = require('glob-all')

module.exports = {
    ...webpackBase,
    plugins: [
        ...webpackBase.plugins,
        // 删除上次打包文件
        new CleanWebpackPlugin(),
        // new BundleAnalyzerPlugin(),
        // new PurifyCSS({
        //     paths: glob.sync([
        //         path.resolve(__dirname, '../src/*.jsx')
        //     ])
        // })
    ],
    optimization: {
        runtimeChunk: 'single',
        splitChunks: {
            chunks: 'all',
            automaticNameDelimiter: '.',
            cacheGroups: {
                vender: {
                    name: 'vender',
                    test: /[\\/]node_modules[\\/]/,
                    priority: 10,
                    minSize: 0,
                    chunks: 'initial'
                },
            }
        },
        minimizer: [
            new UglifyJsPlugin({
                cache: true,
                sourceMap: true,
                parallel: true,
            }),
            new OptimizeCSSAssetsPlugin({})
        ]
    },
    mode: 'production'
}