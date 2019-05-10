import React from 'react'
import { 
    JSXFormData, 
    getAndSetKeyValue,
    cloneData,
    isValueEqual,
} from './utils'

export default class FormText extends React.Component {
    constructor(props){
        super()
        this.state = {
            value: undefined
        }
        // 是否允许render
        this.isReRender = true
    }
    shouldComponentUpdate(nextProps, nextState) {
        const { localUpdate = true } = this.JSXFormData
        return !localUpdate || this.isReRender
    }
    // 修改value
    modifyValue = (value) => {
        if(!isValueEqual(this.state.value, value)){
            this.isReRender = true
            this.setState({value: cloneData(value)})
        }
    }
    // 初次渲染读取数据
    getJSXFormData = (context) => {
        // JSXFormData已存在，不再重复渲染
        if(this.JSXFormData){
            return
        }
        const { html = '' } = this.props
        this.JSXFormData = context
        // 注册修改函数
        const eleList = this.JSXFormData.eleList
        if(!eleList[html]){
            eleList[html] = []
        }
        if(!eleList[html].includes(this.modifyValue)){
            eleList[html].push(this.modifyValue)
        }
        // 初始化FormItem的值
        const value = getAndSetKeyValue(context.formData, html, undefined)
        this.setState({value: cloneData(value)})
    }
    parseChildren = () => {
        const { children, packing = {} } = this.props
        const { value } = this.state
        if(!this.JSXFormData || !children){
            return
        }
        let displayValue = value
        if(packing.input && packing.input instanceof Function){
            displayValue = packing.input(value)
        }
        children.props = {
            ...children.props,
            children: displayValue
        }
        this.isReRender = false
        return children
    }
    render() {
        return <>
            <JSXFormData.Consumer>
                {context => this.getJSXFormData(context)}
            </JSXFormData.Consumer>
            {this.parseChildren()}
        </>
    }
}