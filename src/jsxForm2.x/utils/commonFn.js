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
            finalData[key] = typeof value === 'undefined' ? finalData[key] : value
            return finalData[key]
        }else if(finalData[key] instanceof Object) {
            finalData = finalData[key]
        }else {
            finalData[key] = /^\d+$/.test(keyList[i + 1]) ? [] : {}
            finalData = finalData[key]
        }
    }
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
const clearCache = (Fn, callback) => {
    const keys = Object.keys(delayCache)
    if(Fn && Fn instanceof Function){
        const assistKeys = []
        const modelKeys = []
        // 辅助数据先进行刷新
        keys.forEach((key, idx) => {
            if(key.indexOf('_assistData') === 0){
                assistKeys.push(key)
            }else {
                modelKeys.push(key)
            }
        })
        const assistLen = assistKeys.length
        const modelLen = modelKeys.length
        assistKeys.forEach((key, idx) => {
            Fn(key, delayCache[key], false, idx === assistLen - 1)
        })
        modelKeys.forEach((key, idx) => {
            const newFormData = Fn(key, delayCache[key], idx === modelLen - 1, false)
            if(idx === modelLen - 1 && callback && callback instanceof Function){
                callback(cloneData(newFormData))
            }
        })
    }
    lastTime = Date.now()
    delayCache = {}
}
export const delayExecFn = (key, value, Fn, callback) => {
    const now = Date.now()
    let callbackFn = callback
    if(JSON.stringify(delayCache) === '{}'){
        lastTime = now
    }
    if(key instanceof Object){
        const keys = Object.keys(key)
        keys.forEach(keyItem => {
            delayCache[keyItem] = key[keyItem]
        })
        callbackFn = value
    }else if(typeof key === 'string'){
        delayCache[key] = value
    }else {
        return
    }
    if(now - lastTime >= interTime){
        clearCache(Fn, callbackFn)
    }else{
        setTimeout(() => {
            const now = Date.now()
            if(now - lastTime >= interTime){
                clearCache(Fn, callbackFn)
            }
        }, interTime)
    }
}

// 触发对应key的更新函数
const execUpdateFn = (eleList, key, formData) => {
    const value = getAndSetKeyValue(formData, key)
    const modifyFns = eleList[key] || []
    modifyFns.forEach(Fn => {
        if(Fn && Fn instanceof Function){
            Fn(value)
        }
    })
}

// 广播key的修改
export const boardUpdate = (eleList, key, formData) => {
    // 更新当前key对应表单值
    execUpdateFn(eleList, key, formData)
    // 再更新子元素
    setTimeout(() => {
        const keys = Object.keys(eleList)
        const updateKeys = keys.filter(curKey => curKey.indexOf(key) === 0 && curKey !== key)
        updateKeys.forEach(curKey => {
            execUpdateFn(eleList, curKey, formData)
        })
    })
    
}