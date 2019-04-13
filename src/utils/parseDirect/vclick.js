import {execDirective} from '../index'
// 包装原生的onClick函数
const addOnClick = (element, attachFn) => {
    const onClick = element.props.onClick
    element.props.onClick = function(...args) {
        if(onClick && onClick instanceof Function){
            onClick(...args)
        }
        attachFn(...args)
    }
}

// v-click附加执行函数
const getAttachFn = (element, options) => {
    const vClick = element.props['v-click']
    return (...args) => {
        execDirective(vClick, options.formData)
        options.setState(options.formData)
    }
}

export default (element, options) => {
    // 包装原生的onClick函数
    addOnClick(element, getAttachFn(element, options))
}