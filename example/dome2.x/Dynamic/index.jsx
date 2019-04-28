import React, { createRef } from 'react'
import JSXForm from '../../../src'
import { Input, Select, Button, Icon } from 'antd';
import './index.less'
const Option = Select.Option
const TextArea = Input.TextArea

export default class Base extends React.Component {
    constructor(){
        super()
        this.state = {
            formData: {
                paramList: [
                    {
                        name: '测试123',
                        type: 'string',
                        desc: ''
                    },
                ]
            }
        }
        this.JSXForm = React,createRef()
    }
    render() {
        const {formData} = this.state
        return <div className="dynamic-form-area">
            <JSXForm ref={this.JSXForm} value={formData} onChange={(valid, data) => console.log(valid, data)}>
                <div v-for="(item, index) in paramList">
                    <Input v-model="item.name" v-label={`Param名称${index}`} v-label-width={80} />
                    <div className="add-btn" v-bind={() => {}} onClick={() => {
                        const paramList = this.JSXForm.current.getValue('paramList')
                        console.log(paramList)
                        paramList.push({
                            name: '',
                            type: '',
                            desc: ''
                        })
                        this.JSXForm.current.setValue('paramList', paramList)
                    }}>+</div>
                </div>
                
            </JSXForm>
        </div>
    }
}