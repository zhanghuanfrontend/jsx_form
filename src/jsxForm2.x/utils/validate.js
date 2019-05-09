const typeList = [
    'string',
    'number',
    'boolean',
    'integer',
    'float',
]

export const getRules = (validate, label) => {
    const rules = []
    const hintPrev = label || ''
    validate.forEach(item => {
        if(typeof item === 'string'){   // 如果校验规则是字符串
            if(item === 'required'){
                rules.push({required: true, message: `${hintPrev}不能为空`})
            }else if(typeList.includes(item)){
                rules.push({type: item, message: `${hintPrev}格式不正确`})
            }
        }else if(item instanceof RegExp){      // 如果校验为正则表达式
            rules.push({type: 'string', pattern: item, message: `${hintPrev}格式不正确`})
        }else if(item instanceof Function){  // 如果校验为函数

        }
    })
    return rules
}