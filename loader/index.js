const parse = require('./utils/parse.js')
const babel = require('@babel/core')
const options = {
    presets: ['@babel/preset-react']
}

module.exports = (source) => {
    return parse(source, babel.transform, options)
}