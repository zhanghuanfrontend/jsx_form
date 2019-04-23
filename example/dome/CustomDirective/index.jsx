import React from 'react'
import JSXForm from '../../../src'
import { Input, Select, Button, Icon, Radio } from 'antd';
import {osList, typeList} from './testData'
import './index.less'
const Option = Select.Option
const RadioGroup = Radio.Group
const TextArea = Input.TextArea

export default class CustomDirective extends React.Component {
    constructor(){
        super()
        this.state = {
            formData: {
                os: 'web',
                param: '',
                desc: '',
                type: 'string'
            }
        }
    }
    render() {
        const {formData} = this.state
        return <div className="custom-directive">
            <JSXForm value={formData} onChange={data => this.setState({formData: data})}>
                <Input v-d-total={['param', 'param', 'required']} />
                <Select v-d-total={['os', '操作系统']} v-d-options={[osList, Option]}></Select>
                <RadioGroup v-d-total={['type', '类型']} v-d-options={[typeList, Radio]}>
                </RadioGroup>
                <TextArea v-d-total={['desc', '描述']} rows="3"></TextArea>
                <Button className="submit-btn" onClick={this.submitFormData} type="primary">提交</Button>
            </JSXForm>
        </div>
    }
}