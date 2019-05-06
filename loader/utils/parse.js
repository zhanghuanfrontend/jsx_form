const parseDir = require('./parseDir')
const commonFn = require('./commonFn')
const { getParamList, getAttrValue, replaceFunctionParam, cloneData } = commonFn

// 解析处理JSXForm内容
parseReactElement = (reactCode, option) => {
    if(Array.isArray(reactCode)){
        if(reactCode.length === 0){
            return null
        }
        // 保存loop信息
        const loopInfo = cloneData(option.loopInfo)
        const reactStr = reactCode.map(item => {
            const newOption = {
                ...option,
                loopInfo: cloneData(loopInfo)
            }
            return parseReactElement(item, newOption)
        })
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

module.exports = (template, transform, babelOption) => {
    // 识别是否存在JSX_Form组件
    const reg = /^import\s+(.*?)\s+from\s+['"](react_jsx_form|(\.\.\/){3}src)['"]/gm
    // const testReg = /import\s+(.*?)\s+from\s+['"](\.\.\/){3}src['"]/gm
    const matchJSXForm = reg.exec(template)
    if(!matchJSXForm){
        return template
    }
    const JSXFormName = matchJSXForm[1]
    // 读取JSXForm内容
    const regJSXCon = new RegExp(`<\\s*${JSXFormName}([\\s\\S]*?)(?<=[^=])>[\\s\\S]*?<\\s*\\/\\s*${JSXFormName}\\s*>`, 'gm')
    const option = {
        parseReact: parseReactElement,
        JSXFormName,
    }
    return template.replace(regJSXCon, (match, propStr) => {
        const reactCode = transform(match, babelOption).code.slice(0, -1)
        const parsedCode = parseReactElement(reactCode, option)
        return `{${parsedCode}}`
    })
}