import React from 'react'
import JSXForm from '../../../src'
import { Input, Select, Button, Icon } from 'antd';
import {osList} from './testData'
import './index.less'
const TextArea = Input.TextArea

export default class Base extends React.Component {
    constructor(){
        super()
        this.state = {
            formData: {
                os: 'web',
                param: '',
                desc: ''
            }
        }
    }
    render() {
        return <div className="base-form-area">
            <JSXForm 
                value={this.state.formData} 
                onChange={data => this.setState({formData: data})}
            >
                <Input v-model="param" v-label="param" v-validate={['required', /^[a-zA-Z_]+$/g]} />
                <Select v-model="os" v-label="操作系统" v-validate={['required']}>
                    {
                        osList.map(item => <Option value={item}>{item}</Option>)
                    }
                </Select>
                <TextArea v-label="描述" v-model="desc" rows="3"></TextArea>
                <Button className="submit-btn" type="primary">提交</Button>
            </JSXForm>
        </div>
    }
}