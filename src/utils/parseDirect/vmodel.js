// 替换原组件的change事件
import {getKeyValue} from '../index'

export const getChangeFn = (setState, key) => {
    return event => {
        if(setState && setState instanceof Function){
            let value = event
            // 传入的事event对象
            if(event.target && (event.target instanceof HTMLElement || typeof event.target.value !== 'undefined')){
                value = event.target.value
            }
            setState(key, value)
        }
    }
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
                value: curr
            }
            let parent = element.__parent__
            while(parent){
                parent.props = {...parent.props}
                parent = parent.__parent__
            }
        }
        const onChangeFn = element.props.onChange
        if(!onChangeFn || onChangeFn.type !== 'JSX_CHANGE_FN'){
            element.props.onChange = getChangeFn(options.setState, model)
        }
    }
}