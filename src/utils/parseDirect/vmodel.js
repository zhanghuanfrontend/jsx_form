// 替换原组件的change事件
import {getKeyValue} from '../index'

const getChangeFn = (options, key, element) => {
    return event => {
        const { setState } = options
        if(setState && setState instanceof Function){
            let value = event
            // 传入的事event对象
            if(event.target && (event.target instanceof HTMLElement || typeof event.target.value !== 'undefined')){
                value = event.target.value
            }
            setState(key, getOptionPacking(value, 'result', element, options))
        }
    }
}

// 获取配置里的额外处理函数
const getOptionPacking = (value, type, element, options) => {
    const vpacking = element.props['v-packing']
    if(!vpacking || (!vpacking instanceof Object)){
        return value
    }
    if(vpacking[type] && vpacking[type] instanceof Function){
        const curInfo = {}
        let parent = element.__parent__
        while(parent && !parent.__is_root_node__){
            if(parent.__list_by_key__){
                curInfo.listData = getKeyValue(options.formData, parent.__list_by_key__)
                curInfo.index = parent.__list_by_index__
                break
            }
            parent = parent.__parent__
        }
        return vpacking[type](value, curInfo)
    }
    return value
}

export default (element, options) => {
    const model = element.props['v-model']
    // 如果v-model存在
    if(model){
        const prev = element.props.value
        const curr = getKeyValue(options.formData, model)
        if(prev !== curr){
            element.props = {
                ...element.props,
                value: getOptionPacking(curr, 'value', element, options)
            }
            let parent = element.__parent__
            while(parent && !parent.__is_root_node__){
                parent.props = {...parent.props}
                parent = parent.__parent__
            }
        }
        const onChangeFn = element.props.onChange
        if(!onChangeFn || onChangeFn.type !== 'JSX_CHANGE_FN'){
            element.props.onChange = getChangeFn(options, model, element)
        }
    }
}