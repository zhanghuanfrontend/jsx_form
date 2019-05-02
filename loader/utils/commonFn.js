
// 获取参数列表
const getParamList = (param, splitChars = ',') => {
    const paramStr = param.replace(/\s+/g, ' ').trim()
    const stackLen = [0, 0, 0, 0]
    const leftChar = ['(', '[', '{']
    const rightChar = [')', ']', '}']
    const symbol = ['"', "'"]
    const paramList = []
    let start = 0
    let len = paramStr.length
    for(let i = 0; i < len; i++){
        let curWord = paramStr[i]
        const leftIdx = leftChar.indexOf(curWord)
        const rightIdx = rightChar.indexOf(curWord)
        if(leftIdx >= 0){
            stackLen[leftIdx]++
        }
        if(rightIdx >= 0){
            stackLen[rightIdx]--
        }
        // 如果为引号
        if(symbol.includes(curWord)){
            stackLen[3] = (stackLen[3] + 1) % 2
        }
        if(curWord === splitChars && stackLen.every(item => item === 0)){
            paramList.push(paramStr.slice(start, i))
            start = i + 1
        } 
    }
    paramList.push(paramStr.slice(start))
    return paramList
}

// 替换React createElement函数内的内容
const replaceFunctionParam = (reactStr, callback) => {
    const fnName = 'React.createElement('
    const start = reactStr.indexOf(fnName)
    if(start === -1){
        return reactStr
    }
    let stackLen = 0
    const len = reactStr.length
    const fnLen = fnName.length
    let end = start + fnLen
    for(let i = start + fnLen; i < len; i++){
        const char = reactStr[i]
        if(char === '('){
            stackLen++
        }else if(char === ')'){
            if(stackLen === 0){
                end = i + 1
                break
            }else{
                stackLen--
            }
        }
    }
    const boforeStr = reactStr.slice(0, start)
    const endStr = reactStr.slice(end)
    const content = reactStr.slice(start + fnLen, end - 1)
    if(callback && callback instanceof Function){
        return `${boforeStr}${callback(content)}${endStr}`
    }
    return `${boforeStr}${content}${endStr}`
}

// 查找指定属性
const getAttrValue = (attr, paramStr) => {
    const paramList = getParamList(paramStr, ' ')
    if(!Array.isArray(paramList) || paramList.length === 0){
        return null
    }
    let attrValue = null
    paramList.forEach(item => {
        const reg = new RegExp(`${attr}\s*=(.*)`, 'g')
        const match = reg.exec(item)
        if(match){
            attrValue = match[1].trim()
        }
    })
    return attrValue
}

// 拼接key list
const getKeyList = (attrValue, keyList) => {
    const keyStr = keyList.replace(/\.(\d+)/g, '[$1]')
    return `${attrValue}.${keyStr}`
}

// 去掉头尾的引号
const removeMarks = (str) => {
    const dealStr = str.trim()
    const marks = ["'", '"']
    let len = dealStr.length
    const start = dealStr.charAt(0)
    const end = dealStr.charAt(len - 1)
    if(start === end && marks.includes(start)){
        return str.slice(1, -1)
    }
    return str
}


module.exports = {
    getParamList,
    removeMarks,
    getAttrValue,
    getKeyList,
    replaceFunctionParam,
}