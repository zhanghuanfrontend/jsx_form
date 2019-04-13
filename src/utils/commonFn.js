// 深复制data
export const cloneData = (data) => {
    if(Array.isArray(data)){
        return data.map(item => cloneData(item))
    }else if(data instanceof Object){
        const keys = Object.keys(data)
        const newData = {}
        keys.forEach(key => newData[key] = cloneData(data[key]))
        return newData
    }
    return data
}

// 深复制props
export const deepCloneProps = (element) => {
    if(!element || !(element instanceof Object)){
        return element
    }
    if(Array.isArray(element)){
        return element.map(subEle => deepCloneProps(subEle))
    }else if(element.$$typeof && element.$$typeof.toString() === 'Symbol(react.element)'){
        const newEle = {
            ...element,
            props: {
                ...element.props
            }
        }
        const children = newEle.props.children
        if(children && children instanceof Object){
            newEle.props.children = deepCloneProps(children)
        }
        return newEle
    }
    return element
}

// 查找key的上级对象
export const findParentWrap = (data, keyStr) => {
    if(!data || !keyStr){
        return data
    }
    let keyList = []
    let finalData = data 
    if(keyStr.includes('.')){
        keyList = keyStr.split('.')
    }else{
        keyList = [keyStr]
    }
    let len = keyList.length
    let lastKey = ''
    for(let i = 0; i < len - 1; i++) {
        const key = keyList[i]
        if(finalData[key] instanceof Object){
            finalData = finalData[key]
        }else{
            lastKey = key
            break
        }
    }
    lastKey = lastKey || keyList[len - 1]
    return {
        lastWrap: finalData,
        lastKey,
    }
}

// 获取指定key的值
export const getKeyValue = (data, keyStr) => {
    if(!data || !keyStr){
        return data
    }
    const {lastKey, lastWrap} = findParentWrap(data, keyStr)
    return lastWrap[lastKey]
}

// 修改指定key的值
export const modifyKeyValue = (data, keyStr, value) => {
    if(!data || !keyStr){
        return data
    }
    const {lastKey, lastWrap} = findParentWrap(data, keyStr)
    lastWrap[lastKey] = value
    return data
}

// 执行指令字符串
export const execDirective = (directiveStr, formData) => {
    if(!directiveStr || !formData){
        return false
    }
    const keys = Object.keys(formData)
    const hasKeyList = []
    const keyVariable = []
    keys.forEach(key => {
        // 匹配出该变量的RegExp
        const reg = new RegExp(`(^|(?<=\\s))${key}(\\b|$)`)
        if(reg.test(directiveStr)){
            hasKeyList.push(key)
            keyVariable.push(formData[key])
        }
    })
    const execFn = new Function(...hasKeyList, `return ${directiveStr}`)
    let results = false
    try {
        results = execFn(...keyVariable)
    }catch(err) {
        console.log(err)
    }
    return results
}