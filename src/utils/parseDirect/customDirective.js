import React from 'react'
// 处理自定义指令的ReactElement
const dealCopyElement = (element, copyElement, options) => {
    // 处理自定义指令返回props
    const propKeys = Object.keys(copyElement.props)
    propKeys.forEach(dir => {
        if(typeof element.props[dir] === 'undefined' && dir !== 'children'){
            element.props[dir] = copyElement.props[dir]
            if(dir.indexOf('v-') === 0){
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

export default (key, element, options) => {
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
    const copyElement = React.Fragment
    const newElement = curDir.bindFn(copyElement, dirValue)
    // 处理自定义指令的值
    dealCopyElement(element, newElement, options)
}