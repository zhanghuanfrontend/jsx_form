import React from 'react'
import { 
    JSXFormData, 
    JSXFormGlobalData,
    cloneData,
    getAndSetKeyValue,
    outputFormData,
    delayExecFn,
    isValueEqual,
    boardUpdate,
} from './utils'
import Schema from 'async-validator'
const validator = new Schema({})
import FormItem from './FormItem'
import './index.less'

const globalKeys = ['localUpdate', 'labelWidth']

export default class JSXForm extends React.Component {
    constructor(props){
        super(props)
        // 存储context数据
        this.JSXFormData = {
            formData: cloneData(props.value) || {},
            setFormData: this.delayExecFn,
            eleList: {},
            validFnList: {},
            validResults: {},
            validator,
            localUpdate: props.localUpdate,
            labelWidth: props.labelWidth
        }
        this.state = {
            // 暴露给外层的数据
            info: {
                data: cloneData(this.JSXFormData.formData),
                setValue: this.setValue,
                getValue: this.getValue,
                initForm: this.initForm,
                validForm: this.validForm,
            }
        }
        // 注册监听的函数
        this.watchFn = {}
        this.initData = null
    }
    componentWillReceiveProps(nextProps){
        const { value } = nextProps
        if(value 
            && value !== this.props.value
            && !isValueEqual(value, this.props.value)
        ){
            this.spreadDataChange(value)
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
        const {eleList = {}, formData} = this.JSXFormData
        const updateData = cloneData(value)
        this.JSXFormData.formData = Object.assign(formData, value)
        // 对所有已注册的key广播修改
        const keys = Object.keys(eleList)
        keys.forEach(key => {
            const newValue = getAndSetKeyValue(this.JSXFormData.formData, key)
            const modifyFns = eleList[key] || []
            modifyFns.forEach(Fn => {
                if(Fn && Fn instanceof Function){
                    Fn(newValue)
                }
            })
        })
    }
    // 延时执行更新
    delayExecFn = (key, value, callback) => {
        delayExecFn(key, value, this.updateFormData, callback)
    }
    // 修改表单的值
    updateFormData = (key, value, refresh = false, globalRefresh = false) => {
        const { formData = {}, eleList = {}, validResults = {} } = this.JSXFormData
        this.initData = this.initData || cloneData(formData)
        const { onChange, watch = {} } = this.props
        const prev = getAndSetKeyValue(formData, key)
        getAndSetKeyValue(formData, key, value)
        // 广播key的更新
        boardUpdate(eleList, key, formData)
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
        // 延迟刷新
        if(refresh){
            setTimeout(() => {
                if(onChange && onChange instanceof Function){
                    onChange(JSON.stringify(validResults) === '{}', outputFormData(formData))
                }
            })
        }
        // 全局刷新
        if(globalRefresh){
            this.setState({info: {...this.state.info}})
        }
        return formData
    }
    // 校验FormItem
    validFormItem = (key) => {
        const { validFnList } = this.JSXFormData
        if(key && typeof key === 'string') {
            const FnList = validFnList[key] || []
            FnList.forEach(Fn => {
                if(Fn && Fn instanceof Function){
                    Fn()
                }
            })
        }
    }
    // 主动发起校验
    validForm = (key) => {
        const { validFnList, validResults } = this.JSXFormData
        if(key && typeof key === 'string') {
            this.validFormItem(key)
        }else{
            const keys = Object.keys(validFnList)
            keys.forEach(key => {
                this.validFormItem(key)
            })
        }
        return JSON.stringify(validResults) === '{}'
    }
    // 重新初始化表单
    initForm = () => {
        this.setValue(this.initData, () => {
            this.initData = null
        })
    }
    // 获取指定key的值
    getValue = (key) => {
        const { formData = {}, validResults = {}} = this.JSXFormData
        if(!key){
            const validRes = JSON.stringify(validResults) === '{}'
            return validRes ? outputFormData(formData) : false
        }
        return getAndSetKeyValue(formData, key)
    }
    // 设置指定key的值
    setValue = (key, value, callback) => {
        if(!key){
            console.err('请传入正确的key')
            return
        }
        this.delayExecFn(key, value, callback)
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
        const { className = '' } = this.props
        return <div className={`jsx-form-area ${className}`}>
            <JSXFormGlobalData.Provider value={this.state.info}>
                <JSXFormData.Provider value={this.JSXFormData}>
                    {this.props.children}
                </JSXFormData.Provider>
            </JSXFormGlobalData.Provider>
        </div>
    }
}
