import {execDirective} from '../index'
// 处理v-show执行结果
const execVshowRes = (element, execResult) => {
    // 如果v-show表达式为false，则删除元素
    if(!execResult){
        const parent = element.__parent__
        const children = parent.props.children
        if(Array.isArray(children)){
            const idx = children.indexOf(element)
            parent.props.children.splice(idx, 1)
        }else {
            parent.props.children = null
        }
    }
}

// 执行v-show语句
const execVshowStr = (element, options) => {
    const showStr = element.props['v-show']
    const keys = Object.keys(options.formData)
    const hasKeyList = []
    const keyVariable = []
    keys.forEach(key => {
        // 匹配出该变量的RegExp
        const reg = new RegExp(`(^|(?<=\\s))${key}(\\b|$)`)
        if(reg.test(showStr)){
            hasKeyList.push(key)
            keyVariable.push(options.formData[key])
        }
    })
    const execFn = new Function(...hasKeyList, `return ${showStr}`)
    let results = false
    try {
        results = execFn(...keyVariable)
    }catch(err) {
        console.log(err)
    }
    return results
}

export default (element, options) => {
    const showStr = element.props['v-show']
    const execResult = execDirective(showStr, options.formData)
    execVshowRes(element, execResult)
}