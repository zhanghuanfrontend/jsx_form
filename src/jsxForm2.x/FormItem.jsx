import React from 'react'
import { 
    JSXFormData, 
    getKeyValue, 
    getRules, 
    cloneData, 
    isValueEqual 
} from './utils'
import { instanceOf } from 'prop-types';

export default class FormItem extends React.Component {
    constructor(props){
        super()
        this.state = {
            value: undefined,
            errMsg: ''
        }
        // 是否允许render
        this.isReRender = true
    }
    shouldComponentUpdate(nextProps, nextState) {
        return this.isReRender
    }
    // 修改value
    modifyValue = (value) => {
        if(!isValueEqual(this.state.value, value)){
            this.isReRender = true
            this.setState({value: cloneData(value)}, this.validFormItem)
        }
    }
    // 初次渲染读取数据
    getJSXFormData = (context) => {
        // JSXFormData已存在，不再重复渲染
        if(this.JSXFormData){
            return
        }
        const { dataKey } = this.props
        this.JSXFormData = context
        // 注册修改函数
        const eleList = this.JSXFormData.eleList
        if(!eleList[dataKey]){
            eleList[dataKey] = []
        }
        if(!eleList[dataKey].includes(this.modifyValue)){
            eleList[dataKey].push(this.modifyValue)
        }
        // 初始化FormItem的值
        const value = getKeyValue(context.formData, dataKey)
        if(this.state.value !== value){
            this.setState({value: cloneData(value)})
        }
    }
    // 获取修改后onChange
    getOnChangeFn = (onChangeFn) => {
        const { dataKey } = this.props
        const setFormData = this.JSXFormData.setFormData
        return (event) => {
            if(onChangeFn && onChangeFn instanceof Function){
                // 执行已有的onChange事件
                onChangeFn()
            }
            let value = event
            if(event && event.target instanceof Element){
                value = event.target.value
                if(typeof event.target.value === 'undefined'){
                    value = event.target.checked
                }
            }
            // 调用修改函数
            if(setFormData && setFormData instanceof Function){
                setFormData(dataKey, value)
            }
        }
    }
    // 注入value
    parseFormItem = () => {
        const { children, dataKey } = this.props
        const { value } = this.state
        if(!this.JSXFormData || !children){
            return
        }
        // 修改接入Form Item的value和onChange属性
        if(Array.isArray(children)){
            children.value = value
            this.isReRender = false
            return children
        }
        if(children instanceof Function){
            return children(value, dataKey)
        }
        const prev = children.props.value
        if(prev !== value){
            children.props = {
                ...children.props,
                value,
            }
        }
        const onChangeFn = children.props.onChange
        if(!onChangeFn || onChangeFn.type !== 'JSX_FORM_ONCHANGE_FN'){
            children.props.onChange = this.getOnChangeFn(onChangeFn)
            children.props.onChange.type = 'JSX_FORM_ONCHANGE_FN'
        }
        this.isReRender = false
        return children
    }
    // 校验当前表单
    validFormItem = () => {
        const { validate, label, dataKey } = this.props
        const { value, errMsg } = this.state
        const { validator, validResults = {} } = this.JSXFormData || {}
        if(!validator || !Array.isArray(validate) || validate.length === 0){
            return
        }
        const rules = getRules(validate, label)
        const keyName = 'valid-key'
        validator.rules = {[keyName]: rules}
        const validValue = {[keyName]: value}
        validator.validate(validValue, (errors, fields) => {
            if(errors && errors.length > 0){
                this.isReRender = true
                this.setState({errMsg: errors[0].message})
                validResults[dataKey] = errors[0]
            }else if(errMsg) {
                this.isReRender = true
                this.setState({errMsg: ''})
                delete validResults[dataKey]
            }else{
                delete validResults[dataKey]
            }
        })
    }
    render() {
        const {label = '', className = '', labelWidth, dataKey} = this.props
        const {errMsg} = this.state
        let totalLabelWidth = (this.JSXFormData || {}).labelWidth
        return <div className={`jsx-form-form-item ${className ? className : ''}`}>
            {
                label && 
                <span className="jsx-form-form-item-label" style={{width: labelWidth || totalLabelWidth}}>{label}</span>
            }
            <JSXFormData.Consumer>
                {context => this.getJSXFormData(context)}
            </JSXFormData.Consumer>
            <div className="jsx-form-form-item-wrap">
                {this.parseFormItem()}
            </div>
            {
                errMsg &&
                <span className="jsx-form-err-message">
                    {errMsg}
                </span>
            }
        </div>
    }
}