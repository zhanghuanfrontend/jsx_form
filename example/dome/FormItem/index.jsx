import React from 'react'
import { Input } from 'antd';
const TextArea = Input.TextArea
import JSXForm from '../../../src'
import './index.less'

export default class FormItem extends React.Component {
    constructor(){
        super()
        this.state = {
            formData: {
                styles: {
                    border: 'solid 1px #ddd',
                    padding: '10px',
                    color: '#000'
                },
                linkage: {
                    show: true,
                }
            }
        }
    }
    render() {
        const {formData} = this.state
        const vpacking = {
            value: (curValue) => {
                const keys = Object.keys(curValue)
                let valueStr = ''
                keys.forEach((key, idx) => {
                    if(key !== '__next_line__'){
                        const displayValue = typeof curValue[key] === 'undefined' ? '' : `=${curValue[key]}`
                        valueStr += `${idx === 0 ? '' : '\n'}${key}${displayValue}`
                    }
                })
                if(curValue.__next_line__){
                    valueStr += '\n'
                }
                return valueStr
            },
            result: (curValue) => {
                const newValue = {}
                const styles = curValue.split('\n')
                styles.forEach((style, idx) => {
                    if(style){
                        let key = style
                        let value = undefined
                        if(style.includes('=')){
                            key = style.split('=')[0]
                            value = style.split('=')[1]
                        }
                        newValue[key] = value
                    }
                })
                if(!styles[styles.length - 1]){
                    newValue.__next_line__ = true
                } 
                return newValue
            }
        }
        return <div className="form-item-area">
            <div className="input-output-computed">
                <h3>表单组件复杂值处理</h3>
                <JSXForm value={formData} onChange={(data) => {
                    this.setState({formData: data})
                }}>
                    <TextArea 
                        v-label="样式表" 
                        v-model="styles"  
                        v-packing={vpacking}
                        rows="5"></TextArea>
                    <div className="results-area" style={formData.styles}>
                        这里是样式结果
                    </div>
                </JSXForm>
            </div>
        </div>
    }
}
