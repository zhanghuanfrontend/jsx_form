
import React from 'react'
import {
    vmodelParse,
    vforParse,
    vshowParse,
    vlabelParse,
    vvalidateParse,
    vclickParse,
    customDirective,
    dynamicAttr,
} from './index'

// 对指令进行排序
const sortKeys = (keys) => {
    // 指令解析顺序
    const sortDirective = [
        'v-for', 
        'v-label', 
        'v-model', 
        'v-validate', 
        'v-show',
        'v-click',
        'v-packing',
        'v-label-class'
    ]
    const hasKeys = []   // 已有指令
    const customDirective = []     // 自定义指令
    keys.forEach(key => {
        if(key.indexOf('v-d-') === 0){
            customDirective.push(key)
        }else if(sortDirective.includes(key)){
            hasKeys.push(key)
        }
    })
    return [...new Set([
        'v-for',
        ...customDirective,
        ...hasKeys,
        ...keys
    ])]
}


const parseDirect = (key, element, options) => {
    switch(key){
        case 'v-model':
            vmodelParse(element, options)
            break
        case 'v-for':
            vforParse(element, options)
            break
        case 'v-show':
            vshowParse(element, options)
            break
        case 'v-label':
            vlabelParse(element)
            break
        case 'v-validate':
            vvalidateParse(element, options)
            break
        case 'v-click':
            vclickParse(element, options)
            break
        default:
            if(key.indexOf('v-d-') === 0){
                // 如果为自定义指令
                customDirective(key, element, options)
            }else if(key.indexOf('v-$') === 0){
                // 如果为动态属性
                dynamicAttr(key, element, options)
            }
            break
    }
}

const loopDeal = (children, options, parent) => {
    // 如果不为React组件，不处理
    if(!children || !(children instanceof Object)){
        return
    }
    if(Array.isArray(children)){
        // 从后往前开始解析，避免v-for复制的元素
        const len = children.length
        for(let i = len - 1; i >= 0; i--){
            loopDeal(children[i], options, parent)
        }
    }else if(children.$$typeof && children.$$typeof.toString() === 'Symbol(react.element)'){
        const props = children.props
        const hasParseList = children.__has_parse_dir__ || []
        children.__parent__ = parent || null
        let keys = Object.keys(props)
        // 对指令排序，确保v-for指令先执行
        keys = sortKeys(keys)
        keys.forEach(key => {
            // 如果prop是指令
            if(key.indexOf('v-') === 0){
                // 检查指令是否已解析
                if(!hasParseList.includes(key)){
                    parseDirect(key, children, options)
                }
            }
        })
        //  如果存在子元素
        const childElement = children.props.children
        if(childElement && childElement instanceof Object){
            loopDeal(childElement, options, children)
        }
    }
}

export default (parent, options) => {
    const children = parent.props.children
    parent.__is_root_node__ = true
    // 添加处理函数
    options.parseDirect = parseDirect
    options.loopDealFn = loopDeal
    options.customDirective = customDirective
    loopDeal(children, options, parent)
    return parent.props.children
}