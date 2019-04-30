const paths = require('./paths')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin

module.exports = {
    entry: paths.loaderEntry,
    output: {
        filename: 'loader.min.js',
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