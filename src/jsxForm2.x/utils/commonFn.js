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

// 修改指定key的值
export const modifyKeyValue = (data, keyStr, value) => {
    if(!data || !keyStr){
        return data
    }
    const {lastKey, lastWrap} = findParentWrap(data, keyStr)
    lastWrap[lastKey] = value
    return data
}