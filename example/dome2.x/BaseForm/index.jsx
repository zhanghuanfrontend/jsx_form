import React, { createRef } from 'react'
import JSXForm from '../../../src'
import { Input, Select, Button, Icon, Radio } from 'antd';
import './index.less'
import { osList, typeList } from '../utils/testData'
const TextArea = Input.TextArea
const RadioGroup = Radio.Group
const Option = Select.Option

export default class BaseForm extends React.Component {
    constructor(props){
        super()
        this.state = {
            formData: {
                os: 'web',
                param: '',
                desc: '',
                type: 'string'
            },
            refresh: false
        }
    }
    render() {
        const { formData, refresh } = this.state
        return <div className="base-form-area">
            <JSXForm 
                value={formData}
                onChange={(valid, data) => console.log(data)}
            >
                <Input v-model="param" v-label="param" v-validate={['required', /^[a-zA-Z_]+$/g]} />
                <Select v-model="os" allowClear v-label="操作系统" v-validate={['required']}>
                    <Option v-for="(osItem, idx) in {osList}" key={osItem} value={osItem}>{osItem}</Option>
                </Select>
                <RadioGroup v-label="类型" v-model="type">
                    <Radio v-for="typeItem in {typeList}" key={typeItem} value={typeItem}>{typeItem}</Radio>
                </RadioGroup>
                <TextArea v-label="描述" v-model="desc" rows="3"></TextArea>
                <Button className="submit-btn" type="primary" onClick={() => {
                    this.setState({formData: {...formData, param: 'test'}})
                }}>提交</Button>
                {
                    console.log('+====')
                }
                <Button className="submit-btn" type="primary" onClick={() => {
                    this.setState({refresh: !refresh})
                }}>刷新</Button>
            </JSXForm>
        </div>
    }
}