import React from 'react'
// 添加包裹元素
const getEleWrap = (label, element) => {
    // 给element新增classname
    const className = element.props.className
    element.props.className = className ? `${className} v-form-item` : 'v-form-item'
    const wrap = React.createElement('div', {
        className: 'v-form-wrap'
    }, React.createElement('span', {
        className: 'v-form-label'
    }, `${label}:`), element)
    wrap.__parent__ = element.__parent__
    wrap.__form_wrap__ = true
    element.__parent__ = wrap
    return wrap
}

// 在元素上包裹一层
const addElementWrap = (element) => {
    const parent = element.__parent__
    const children = parent.props.children
    const label = element.props['v-label']
    const eleWrap = getEleWrap(label, element)
    if(Array.isArray(children)){
        const idx = children.indexOf(element)
        children.splice(idx, 1, eleWrap)
    }else{
        parent.props.children = eleWrap
    }
}


export default (element) => {
    addElementWrap(element)
}