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

// 判断两个数是否值相等
export const isValueEqual = (preValue, curValue) => {
    if(preValue instanceof Object && curValue instanceof Object){
        const prekeys = Object.keys(preValue)
        const curKeys = Object.keys(curValue)
        if(prekeys.length !== curKeys.length){
            return false
        }
        return prekeys.every(key => {
            return curKeys.includes(key) && isValueEqual(preValue[key], curValue[key])
        })
    }
    return preValue === curValue
}

// 查找key的上级对象
export const findParentWrap = (data, keyStr) => {
    if(!data || !keyStr || 
        typeof keyStr !== 'string'){
        return {lastWrap: data, lastKey: keyStr}
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

// 获取值并赋值
export const getAndSetKeyValue = (data, keyStr, value) => {
    if(!data || !keyStr || typeof keyStr !== 'string'){
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
    for(let i = 0; i < len; i++) {
        const key = keyList[i]
        if(i === len -1){
            finalData[key] = value || finalData[key]
            return finalData[key]
        }else if(finalData[key] instanceof Object) {
            finalData = finalData[key]
        }else {
            finalData[key] = /^\d+$/.test(keyList[i + 1]) ? [] : {}
            finalData = finalData[key]
        }
    }
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

// 剔除输出值的_assistData内容
export const outputFormData = (data) => {
    const output = cloneData(data)
    delete output._assistData
    return output
}

// 延时执行
let delayCache = {}
const interTime = 100
let lastTime = Date.now()
// 清空缓存，并执行缓存内容
const clearCache = (Fn) => {
    const keys = Object.keys(delayCache)
    if(Fn && Fn instanceof Function){
        const len = keys.length
        let globalRefresh = false
        keys.forEach((key, idx) => {
            if(key.indexOf('_assistData') === 0){
                globalRefresh = true
            }
            const refresh = idx === len - 1
            Fn(key, delayCache[key], refresh, refresh && globalRefresh)
        })
    }
    lastTime = Date.now()
    delayCache = {}
}
export const delayExecFn = (key, value, Fn) => {
    const now = Date.now()
    if(JSON.stringify(delayCache) === '{}'){
        lastTime = now
    }
    if(key instanceof Object){
        const keys = Object.keys(key)
        keys.forEach(keyItem => {
            delayCache[keyItem] = key[keyItem]
        })
    }else if(typeof key === 'string'){
        delayCache[key] = value
    }else {
        return
    }
    if(now - lastTime >= interTime){
        clearCache(Fn)
    }else{
        setTimeout(() => {
            const now = Date.now()
            if(now - lastTime >= interTime){
                clearCache(Fn)
            }
        }, interTime)
    }
}