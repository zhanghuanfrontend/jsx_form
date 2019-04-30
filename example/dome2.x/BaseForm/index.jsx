import React, { createRef } from 'react'
import JSXForm from '../../../src'
import { Input, Select, Button, Icon } from 'antd';
import './index.less'
import { osList } from '../utils/testData'
const Option = Select.Option
const TextArea = Input.TextArea

export default class BaseForm extends React.Component {
    constructor(props){
        super()
        this.state = {
            param: {
                name: '',
                os: ''
            }
        }
    }
    render() {
        const { param } = this.state
        return <div className="base-form-area">
            <JSXForm value={param}>
                <Input v-model="name" v-label="name"/>
                <Input v-model="os" v-label="os" />
                <Input v-model="os" v-label="os2" />
            </JSXForm>
        </div>
    }
}