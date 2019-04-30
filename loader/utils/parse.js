const parseDir = require('./parseDir')
const commonFn = require('./commonFn')
const babel = require('@babel/core')

const { getParamList, getAttrValue, replaceFunctionParam } = commonFn

const options = {
    presets: ['@babel/preset-react']
}

// 解析处理JSXForm内容
parseReactElement = (reactCode, option) => {
    if(Array.isArray(reactCode)){
        if(reactCode.length === 0){
            return null
        }
        const reactStr = reactCode.map(item => parseReactElement(item, option))
        if(reactCode.length === 1){
            return reactStr
        }
        return `<>{[${reactStr}]}</>`
    }
    // 去掉多余的空格
    const reactEle = reactCode.replace(/\s+/g, ' ').trim()
    return replaceFunctionParam(reactEle, (eleContent) => {
        const paramList = getParamList(eleContent)
        let [eleName, props, ...children] = paramList
        return parseDir(eleName, props, children, option)
    })
}

module.exports = (template) => {
    // 识别是否存在JSX_Form组件
    const reg = /import\s+(.*?)\s+from\s+['"](react_jsx_form|(\.\.\/){3}src)['"]/gm
    // const testReg = /import\s+(.*?)\s+from\s+['"](\.\.\/){3}src['"]/gm
    const matchJSXForm = reg.exec(template)
    if(!matchJSXForm){
        return template
    }
    const JSXFormName = matchJSXForm[1]
    // 读取JSXForm内容
    const regJSXCon = new RegExp(`<\\s*${JSXFormName}([\\s\\S]*?)(?<=[^=])>[\\s\\S]*<\\s*\\/\\s*${JSXFormName}\\s*>`, 'gm')
    const option = {
        parseReact: parseReactElement,
        JSXFormName,
    }
    return template.replace(regJSXCon, (match, propStr) => {
        const reactCode = babel.transform(match, options).code.slice(0, -1)
        const parsedCode = parseReactElement(reactCode, option)
        return `{${parsedCode}}`
    })
}