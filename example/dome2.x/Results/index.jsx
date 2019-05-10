import React from 'react'
import { Button, Icon, Input, Form }  from 'antd';
import JSXForm from '../../../src'
import './index.less'

export default class Editor extends React.Component {
    render() {
        return <JSXForm labelWidth={50}>
            <Input v-model="name" v-label="名称" />
            <Input v-total={['type', '类型', 'required']}/>
        </JSXForm>
    }
}

{/* <div className="base-form-area">
    <JSXForm  value={this.state.formData} onChange={() => this.setState({refresh: !this.state.refresh})}>
        <Input v-model="name" />
        <Input v-total={['os', '操作系统', /^[^\d]*$/g, 'required']}/>
        <Input v-model="type" v-init="mm" />
        <span v-html="os" name="test" v-packing={{input: (curValue) => {
            return <div className="test-area">{curValue}</div>
        }}}></span>
        <Button className="submit-btn" type="primary" onClick={() => {
            this.setState({formData: {...this.state.formData, os: 'qwe'}})
        }}>修改值</Button>
        <Button className="submit-btn" type="primary" onClick={() => {
            console.log(_self.validForm())
        }}>校验表单</Button>
    </JSXForm>
</div> */}