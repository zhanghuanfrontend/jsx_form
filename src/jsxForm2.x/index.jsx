import React from 'react'
import { 
    JSXFormData, 
    modifyKeyValue, 
    getKeyValue,
    JSXFormGlobalData,
    cloneData,
} from './utils'
import Schema from 'async-validator'
const validator = new Schema({})
import FormItem from './FormItem'
import './index.less'

const globalKeys = ['localUpdate', 'labelWidth']

export default class JSXForm extends React.Component {
    constructor(props){
        super(props)
        this.state = {}
        // 存储context数据
        this.JSXFormData = {
            formData: cloneData(props.value) || {},
            setFormData: this.updateFormData,
            eleList: {},
            validResults: {},
            validator,
            localUpdate: props.localUpdate,
            labelWidth: props.labelWidth
        }
        // 暴露给外层的数据
        this.info = {
            data: this.JSXFormData.formData,
            setValue: this.setValue,
            getValue: this.getValue,
            cloneData: cloneData,
        }
        // 注册监听的函数
        this.watchFn = {}
    }
    componentWillReceiveProps(nextProps){
        if(nextProps.value && nextProps.value !== this.props.value){
            this.spreadDataChange(nextProps.value)
        }
        const updateKeys = Object.keys(nextProps)
        updateKeys.forEach(key => {
            if(nextProps[key] !== this.props[key] && globalKeys.includes(key)){
                this.JSXFormData[key] = nextProps[key]
            }   
        })
    }
    // 广播数据的修改
    spreadDataChange = (value = {}) => {
        const {eleList = {}} = this.JSXFormData
        this.JSXFormData.formData = value
        // 对所有已注册的key广播修改
        const keys = Object.keys(eleList)
        keys.forEach(key => {
            const newValue = getKeyValue(value, key)
            const modifyFns = eleList[key] || []
            modifyFns.forEach(Fn => {
                if(Fn && Fn instanceof Function){
                    Fn(newValue)
                }
            })
        })
    }
    // 修改表单的值
    updateFormData = (key, value) => {
        const { formData = {}, eleList = {}, validResults = {} } = this.JSXFormData
        const { onChange, watch = {} } = this.props
        const prev = getKeyValue(formData, key)
        let newFormData = formData
        if(typeof value === 'undefined'){
            newFormData = key
            this.JSXFormData.formData = key
        }else{
            newFormData = modifyKeyValue(formData, key, value)
        }
        const modifyFns = eleList[key] || []
        modifyFns.forEach(Fn => {
            if(Fn && Fn instanceof Function){
                Fn(value)
            }
        })
        setTimeout(() => {
            if(onChange && onChange instanceof Function){
                onChange(JSON.stringify(validResults) === '{}', newFormData)
            }
        })
        // 触发监听
        const watchFn = watch[key]
        if(watchFn && watchFn instanceof Function){
            watchFn(prev, value)
        }
        // 触发注册的监听函数
        const watchFnList = this.watchFn[key] || []
        watchFnList.forEach(watchFn => {
            if(watchFn && watchFn instanceof Function){
                watchFn(prev, value)
            }
        })
    }
    // 获取指定key的值
    getValue = (key) => {
        const { formData = {} } = this.JSXFormData
        if(!key){
            return formData
        }
        return getKeyValue(formData, key)
    }
    // 设置指定key的值
    setValue = (key, value) => {
        this.updateFormData(key, value)
    }
    // 监听指定key的值
    watch = (key, callback) => {
        if(!this.watchFn[key]){
            this.watchFn[key] = []
        }
        if(!this.watchFn[key].includes(callback)){
            this.watchFn[key].push(callback)
        }
    }
    render() {
        return <div className="jsx-form-area">
            <JSXFormGlobalData.Provider value={this.info}>
                <JSXFormData.Provider value={this.JSXFormData}>
                    {this.props.children}
                </JSXFormData.Provider>
            </JSXFormGlobalData.Provider>
        </div>
    }
}
