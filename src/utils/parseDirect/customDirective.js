// 处理自定义指令的ReactElement
const dealCopyElement = (element, copyElement, options) => {
    const propKeys = Object.keys(copyElement.props)
    // 灌入children
    let children = element.props.children
    let copyChildren = copyElement.props.children
    children = Array.isArray(children) 
        ? children 
        : children ? [children] : []
    copyChildren = Array.isArray(copyChildren) 
        ? copyChildren 
        : copyChildren ? [copyChildren] : []
    children.push(...copyChildren)
    if(children.length > 0){
        element.props.children = children
    }
    // 额外处理新增props
    const addProps = propKeys.filter(key => 
        typeof element.props[key] === 'undefined' 
        && key !== 'children')
    addProps.forEach(dir => {
        element.props[dir] = copyElement.props[dir]
        if(dir.indexOf('v-') === 0){
            options.parseDirect(dir, element, options)
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
    // ReactElement的副本
    const copyElement = {
        ...element,
        props: {
            ...element.props,
            children: []
        }
    }
    curDir.bindFn(copyElement, dirValue)
    // 处理自定义指令的值
    dealCopyElement(element, copyElement, options)
}