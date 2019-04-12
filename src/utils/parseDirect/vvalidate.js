import React from 'react'
import Schema from 'async-validator'
import { instanceOf } from 'prop-types';
const validator = new Schema({})
const typeList = [
    'string',
    'number',
    'boolean',
    'integer',
    'float',
]
// 为label添加*
const addRequiredIcons = (element) => {
    const parent = element.__parent__
    if(!parent.__form_wrap__){
        return
    }
    const requiredIcon = React.createElement('span', {
        className: 'required-icon',
    }, '*')
    const labelWrap = parent.props.children[0]
    const label = labelWrap.props.children
    labelWrap.props.children = [requiredIcon, label]
}

// 包装成rules
const getRulesObj = (validateList, element) => {
    const labelStr = element.props['v-label']
    if(!Array.isArray(validateList)){
        return []
    }
    const rules = []
    validateList.forEach(item => {
        if(typeof item === 'string'){   // 如果校验规则是字符串
            if(item === 'required'){
                rules.push({required: true, message: `${labelStr}不能为空`})
                // 为label添加*
                addRequiredIcons(element)
            }else if(typeList.includes(item)){
                rules.push({type: item, message: `${labelStr}格式不正确`})
            }
        }else if(item instanceof RegExp){      // 如果校验为正则表达式
            rules.push({type: 'string', pattern: item, message: `${labelStr}格式不正确`})
        }else if(item instanceof Function){  // 如果校验为函数

        }
    })
    return rules
}

// 显示报错信息
const displayErrorInfo = (element, error) => {
    const parent = element.__parent__
    if(!parent.__form_wrap__){
        return
    }
    const errorComp = React.createElement('div', {
        className: 'error-info',
    }, error.message)
    parent.props.children.push(errorComp)
}

// 校验表单
const validFormItem = (rules, element, options) => {
    const keyName = 'valid-key'
    validator.rules = {[keyName]: rules}
    const validValue = {[keyName]: element.props.value}
    const modelStr = element.props['v-model']
    console.log(rules)
    validator.validate(validValue, (errors, fields) => {
        if(errors && errors.length > 0){
            const error = { message: errors[0].message, key: modelStr}
            if(options.setError && options.setError instanceof Function){
                options.setError(error)
                displayErrorInfo(element, error)
            }
        }
    })
}


export default (element, options) => {
    const validateList = element.props['v-validate']
    const rules = getRulesObj(validateList, element)
    validFormItem(rules, element, options)
}