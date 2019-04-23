
import { getKeyValue, deepCloneProps } from '../index'
// 解析v-for指令语句
const forReg = /^(.+)\bin\b(.+)$/
// 读取item的多个变量
const forItemReg = /\((.+),(.+)\)/

// 递归替换指令中的变量
const loopReplace = (element, options, itemName, listKey, $index, parent) => {
    if(!element || !(element instanceof Object)){
        return
    }
    if(Array.isArray(element)){
        element.forEach(subEle => loopReplace(subEle, options, itemName, listKey, $index, parent))
    }else if(element.$$typeof && element.$$typeof.toString() === 'Symbol(react.element)'){
        element.__parent__ = parent || null
        const props = element.props
        let keys = Object.keys(props)
        // 提取出自定义指令，并先进行解析
        const customDir = keys.filter(key => key.indexOf('v-d-') === 0)
        if(customDir.length > 0){
            customDir.forEach(key => {
                // 最后一个参数表明，不需要在v-for解析过程中执行新增指令的解析
                options.customDirective(key, element, options, false)
                // 添加已解析指令列表
                if(!element.__has_parse_dir__){
                    element.__has_parse_dir__ = []
                }
                element.__has_parse_dir__.push(key)
            })
            keys = Object.keys(props)
        }
        keys.forEach(key => {
            if(key.indexOf('v-') === 0 && 
                props[key] && typeof props[key] === 'string'){
                let varName = itemName
                // 如果是多个变量名
                if(Array.isArray(itemName)){
                    varName = itemName[0]
                    element.props[key] = props[key]
                        .replace(itemName[1], $index)
                }
                element.props[key] = props[key]
                    .replace(varName, `${listKey}.${$index}`)
            }
        })
        const children = element.props.children
        if(children && children instanceof Object){
            loopReplace(children, options, itemName, listKey, $index, element)
        }
    }
}

// 复制elements
const copyNewElement = (element, options, childWrap, list, vfor, dealCopyEle) => {
    if(!Array.isArray(list)){
        return []
    }
    const beginIdx = childWrap.indexOf(element)
    const {itemName, listKey} = parsevForDirective(vfor)
    // 保存原始element
    const originEle = deepCloneProps(element)
    // 如果list为空
    if(list.length === 0){
        childWrap.splice(beginIdx, 1)
        return
    }
    // 复制多个元素
    list.forEach((item, idx) => {
        const curIdx = beginIdx + idx
        const existElement = childWrap[curIdx] || {}
        if(existElement.__list_by_key__ !== `${listKey}`){
            const newElement = idx === 0 ? element : deepCloneProps(originEle)
            newElement.__list_by_key__ = `${listKey}`
            newElement.__list_by_index__ = idx
            newElement.__list_by_var__ = itemName
            // 递归替换props下item变量
            loopReplace(newElement, options, itemName, listKey, idx, newElement.__parent__)
            if(idx === 0){
                // 对于原始element还原v-for指令
                newElement.props['v-for'] = vfor
            }else{
                // 对于复制出来的element剔除v-for指令，并且重新解析指令
                delete newElement.props['v-for']
                dealCopyEle(newElement)
            }
            childWrap.splice(curIdx, idx === 0 ? 1 : 0, newElement)
        }
    })
}
// 解析v-for语句
const parsevForDirective = (vfor) => {
    const match = vfor.match(forReg)
    let itemName = ''
    let listKey = ''
    if(match){
        itemName = match[1].trim()
        listKey = match[2].trim()
        // 如果item是多个变量
        const varMatch = itemName.match(forItemReg)
        if(varMatch){
            itemName = [varMatch[1].trim(), varMatch[2].trim()]
        }
    }   
   return {itemName, listKey}
}

export default (element, options) => {
    const parent = element.__parent__
    const vfor = element.props['v-for']
    if(!vfor){
        return
    }
    const { listKey } = parsevForDirective(vfor)
    const list = getKeyValue(options.formData, listKey)
    const dealCopyEle = (copyElement) => {
        options.loopDealFn(copyElement, options, parent)
    }
    if(parent){
        let childWrap = parent.props.children
        if(!Array.isArray(childWrap)){
            parent.props.children = [childWrap]
            childWrap = parent.props.children
        }
        // 复制Item
        copyNewElement(element, options, childWrap, list, vfor, dealCopyEle)
    }
}