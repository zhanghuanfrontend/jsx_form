import React from 'react'
import { Button, Icon, Input }  from 'antd';
import JSXForm from '../../../src'
import './index.less'

export default class Editor extends React.Component {
    constructor(){
        super()
        this.state = {
            refresh: false,
            formData: {
                name: 'test',
                os: 'mmmmm'
            }
        }
    }
    render() {
        return <div className="base-form-area">
            <JSXForm  value={this.state.formData} onChange={() => this.setState({refresh: !this.state.refresh})}>
                <Input v-model="name" />
                <Input v-model="os" v-validate={[/^[^\d]*$/g]} />
                <Input v-model="type" v-init="mm" />
                <Button className="submit-btn" type="primary" onClick={() => {
                    this.setState({formData: {...this.state.formData, os: 'qwe'}})
                }}>修改值</Button>
                <Button className="submit-btn" type="primary" onClick={() => {
                    console.log(_self.validForm())
                }}>校验表单</Button>
            </JSXForm>
        </div>
    }
}