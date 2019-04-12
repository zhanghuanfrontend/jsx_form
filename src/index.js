import React from 'react'
import {
    cloneData,
    parse,
    modifyKeyValue,
} from './utils'
import './index.less'

export default class JSXForm extends React.Component {
    constructor(props){
        super()
        this.state = {
            formData: cloneData(props.value) || {},
            errors: []
        }
    }
    componentWillReceiveProps(nextProps){
        if(nextProps.value){
            this.setState({formData: cloneData(nextProps.value) || {}})
        }
    }
    // 修改value的值
    modifyValueFn = (key, updateValue) => {
        const {onChange, watch = {}, value} = this.props
        const {formData} = this.state

        // 触发watch对应函数
        // if(watch[key] && watch[key] instanceof Function){
        //     watch[key](formData[key], updateValue)
        // }
        // 如果value prop存在，则表单组件为受控组件，不再内部修改state
        if(typeof value !== 'undefined'){
            if(onChange && onChange instanceof Function){
                onChange(modifyKeyValue(formData, key, updateValue))
            }
            return
        }
        // 如果为非受控表单，则修改内部state
        this.setState({formData: modifyKeyValue(formData, key, updateValue)}, () => {
            // 触发onChange事件
            if(onChange && onChange instanceof Function){
                onChange(this.state.formData)
            }
        })
    }
    // 校验报错
    addValidError = (error) => {
        // this.setState({
        //     errors: [...this.state.errors, error]
        // })
    }
    render() {
        const {className = ''} = this.props
        const {formData} = this.state
        const options = {
            formData,
            setState: this.modifyValueFn,
            setError: this.addValidError
        }
        return <div className={`${className} jsx-form-area`}>
            {parse(this, options)}
        </div>
    }
}