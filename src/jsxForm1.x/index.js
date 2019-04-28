import React from 'react'
import {
    cloneData,
    parse,
    modifyKeyValue,
    getKeyValue,
} from './utils'
import './index.less'

export default class JSXForm extends React.Component {
    constructor(props){
        super()
        this.state = {
            formData: cloneData(props.value) || {},
            errors: []
        }
        this.cache = {}
        this.errors = {}
    }
    componentWillReceiveProps(nextProps){
        if(nextProps.value){
            this.setState({formData: cloneData(nextProps.value) || {}})
        }
    }
    static customDirective = []
    // 自定义指令
    static directive = (name, callback) => {
        if(name.indexOf('v-d-') !== 0){
            console.error('自定义指令必须以v-d-开头')
            return
        }
        JSXForm.customDirective.push({
            dirName: name,
            bindFn: callback
        })
    }
    // 修改state或者onChange
    updateValueFn = (formData) => {
        const {value, onChange} = this.props
        // 如果value prop存在，则表单组件为受控组件，不再内部修改state
        if(typeof value !== 'undefined'){
            if(onChange && onChange instanceof Function){
                onChange(formData)
            }
            return
        }
        // 如果为非受控表单，则修改内部state
        this.setState({formData, }, () => {
            // 触发onChange事件
            if(onChange && onChange instanceof Function){
                onChange(formData)
            }
        })
    }
    // 修改value的值
    modifyValueFn = (key, value) => {
        const {formData} = this.state
        let newFormData = {}
        if(typeof key !== 'undefined' && typeof key === 'string'){
            // 触发相应watch里的函数
            const {watch = {}} = this.props
            if(watch[key] && watch[key] instanceof Function){
                setTimeout(() => {
                    watch[key](getKeyValue(formData, key), value)
                })
            }
            // 如果有两个参数，则key、value修改
            newFormData = modifyKeyValue(formData, key, value)
        }else if(key instanceof Object){
            newFormData = cloneData(key)
        }
        this.updateValueFn(newFormData)
    }
    // 获取值
    getValue = (callback) => {
        const {formData} = this.state
        const keys = Object.keys(this.errors)
        const valid = !keys.length
        if(callback && callback instanceof Function){
            callback(valid, formData)
        }
        return valid && formData
    }
    // 校验报错
    addValidError = (error, key) => {
        this.errors[key] = error
    }
    // 取消报错
    cancelError = (key) => {
        delete this.errors[key]
    }
    render() {
        const {className = ''} = this.props
        const {formData} = this.state
        const options = {
            formData,
            setState: this.modifyValueFn,
            setError: this.addValidError,
            cancelError: this.cancelError,
            cache: this.cache,
            directive: JSXForm.customDirective
        }
        let children = null
        try {
            children = parse(this, options)
        }catch(error){
            console.error(error)
        }
        return <div className={`${className} jsx-form-area`}>
            {children}
        </div>
    }
}