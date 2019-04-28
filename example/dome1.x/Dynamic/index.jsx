import React, { createRef } from 'react'
import JSXForm from '../../../src'
import { Input, Select, Button, Icon } from 'antd';
import { paramList, typeList } from './testData'
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
                        name: '',
                        type: 'string',
                        desc: ''
                    },
                    // {
                    //     name: '',
                    //     type: 'integer',
                    //     desc: ''
                    // }
                ]
            }
        }
        this.JSXForm = React,createRef()
    }
    render() {
        const {formData} = this.state
        return <div className="dynamic-form-area">
            <JSXForm ref={this.JSXForm} value={formData} onChange={(data) => {
                this.setState({formData: data})
            }}>
                <div className="param-item" v-for="(item, index) in paramList">
                    <div className="param-rows">
                        <Select 
                            v-d-options={[paramList.map(item => item.name), Option]} 
                            v-$disabled="item.name"
                            v-d-total={['item.name', 'param']} v-label-class="param-select">
                        </Select>
                        <Select className="type-select" v-model="item.type">
                            {
                                typeList.map(item => <Option value={item}>{item}</Option>)
                            }
                        </Select>
                    </div>
                    <TextArea v-packing={{
                            value: (curValue, curInfo) => {
                                return curValue
                            }
                        }} 
                        v-d-disabled="item.desc === '123'"
                        v-d-total={['item.desc', '描述', 'required']} rows="3"></TextArea>
                    <div className="add-btn" v-click="paramList.push({name: '', type: 'integer', desc: ''})" v-show="index === paramList.length - 1">+</div>
                    <div className="delete-btn" v-show="paramList.length > 1" v-click="paramList.splice(index, 1)">
                        <Icon theme="filled" type="delete" />
                    </div>
                </div>
                <Button className="submit-btn" type="primary">提交</Button>
            </JSXForm>
        </div>
    }
}