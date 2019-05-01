import parse from './utils/parse.js'
import transform from  './utils/babel-browser.js'
import React from 'react'
import JSXForm from 'src/index.js'
// import JSXForm from 'react_jsx_form'
const injectCode = `import JSXForm from 'react_jsx_form'`

const dealRes = (code) => {
    const codeStr = `${injectCode}${code}`
    const parseCode = parse(codeStr, transform, {})
    // 对解析结果进行进一步处理
    const displayCode = parseCode
        .replace(injectCode, '')
        .replace('"use strict";', '')
        .replace(/(<>|<\/>)/g, (match) => {
            if(match === '<>'){
                return '<div>'
            }
            return '</div>'
        })
    return transform(`<div>${displayCode}</div>`)
        .code
        .replace('"use strict";', '')
        .trim()
}

const parseReactEle = (code, dependence) => {
    const applyKey = Object.keys(dependence)
    const varList = applyKey.map(key => dependence[key])
    const execFn = new Function('React', 'JSXForm', ...applyKey ,`return ${code}`)
    return execFn(React, JSXForm, ...varList)
}

export default {
    parse: dealRes,
    parseReact: parseReactEle,
}