import React from 'react'
import { execDirective } from '../commonFn'
// 处理自定义指令的ReactElement
const dealCopyElement = (element, copyElement, options, isParseDir) => {
    // 处理自定义指令返回props
    const propKeys = Object.keys(copyElement.props)
    propKeys.forEach(dir => {
        if(typeof element.props[dir] === 'undefined' && dir !== 'children'){
            element.props[dir] = copyElement.props[dir]
            if(dir.indexOf('v-') === 0 && isParseDir){
                options.parseDirect(dir, element, options)
            }
        }else if(dir === 'children' && copyElement.props.children){
            const children = element.props.children
            const copyChildren = copyElement.props.children
            const addChildren = Array.isArray(copyChildren) ? copyChildren : [copyChildren]
            if(!children){
                element.props.children = copyChildren
            }else if(Array.isArray(children)){
                children.push(...addChildren)
            }else {
                element.props.children = [children]
                element.props.children.push(...addChildren)
            }
        }
    })
}

// 获取指令的返回值
const getDirValue = (isParseDir, dir, formData, element) => {
    if(typeof dir !== 'string'){
        return undefined
    }
    if(isParseDir){
        return execDirective(dir, formData)
    }else {
        const curInfo = {}
        let parent = element.__parent__
        while(parent && !parent.__is_root_node__){
            if(parent.__list_by_key__){
                curInfo.parentKey = parent.__list_by_key__
                curInfo.index = parent.__list_by_index__
                curInfo.itemName = parent.__list_by_var__
                break
            }
            parent = parent.__parent__
        }
        // 替换掉指令里的变量
        let execDir = dir
        if(curInfo.parentKey){
            const {itemName, parentKey, index} = curInfo
            let varName = itemName
            if(Array.isArray(itemName)){
                varName = itemName[0]
                execDir = execDir.replace(itemName[1], index)
            }
            execDir = execDir.replace(varName, `${parentKey}.${index}`)
        }
        return execDirective(execDir, formData)
    }
}

export default (key, element, options, isParseDir = true) => {
    // 如果不是自定义指令，则忽略
    if(key.indexOf('v-d-') !== 0){
        return
    }
    const dirList = options.directive || []
    const curDir = dirList.find(item => item.dirName === key)
    if(!curDir){
        return
    }
    const dirValue = element.props[key]
    const copyElement = React.Fragment;
    const dirBack = getDirValue(isParseDir, dirValue, options.formData, element)
    const newElement = curDir.bindFn(copyElement, dirValue, dirBack)
    // 处理自定义指令的值
    dealCopyElement(element, newElement, options, isParseDir)
}