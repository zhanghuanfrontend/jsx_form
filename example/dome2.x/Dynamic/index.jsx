import React, { createRef } from 'react'
import JSXForm from '../../../src'
import { Input, Select, Button, Icon } from 'antd';
import './index.less'
import { osList } from '../utils/testData'
const Option = Select.Option
const TextArea = Input.TextArea

export default class Base extends React.Component {
    constructor(){
        super()
        this.state = {
            formData: {
                paramList: [
                    {
                        name: '测试1',
                        os: '',
                    },
                    {
                        name: '测试2',
                        os: '',
                    },
                    {
                        name: '测试3',
                        os: '',
                    },
                ]
            }
        }
        this.JSXForm = React,createRef()
    }
    render() {
        const {formData} = this.state
        return <div className="dynamic-form-area">
            <JSXForm 
                value={formData} 
                labelWidth={60}
                onChange={(valid, data) => {}}>
                <div v-for="(item, index) in paramList">
                    <Input v-total={['item.name', `名称${index}`]} />
                    <Select v-model="item.os" onChange={value => {
                        const curParam = {
                            name: 123,
                            os: value
                        }
                        _self.setValue(`paramList.${index}`, curParam)
                    }} style={{width: '100%'}} allowClear v-label="操作系统">
                        <Option v-for="osItem in {osList}" key={osItem} value={osItem}>{osItem}</Option>
                    </Select>
                    <div className="add-btn" 
                        v-show={index === _self.getValue('paramList').length - 1} 
                        onClick={() => {
                            const list = _self.getValue('paramList')
                            list.push({
                                name: '测试123',
                                os: '234'
                            })
                            _self.setValue('paramList', list)
                        }
                    }>+</div>
                    <div className="delete-btn" 
                        v-show={index !== 0}
                        onClick={() => {
                            const list = _self.getValue('paramList')
                            list.splice(index, 1)
                            console.log(list)
                            _self.setValue('paramList', list)
                        }
                    }>
                        <Icon theme="filled" type="delete" />
                    </div>
                </div>
            </JSXForm>
        </div>
    }
}