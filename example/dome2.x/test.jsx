import React from 'react'
import JSXForm from 'react_jsx_form'
import { Input } from 'antd'


export default class Test extends React.Component {
    constructor(){
        super()
        this.state = {
            formData: {
                param: {
                    name: '',
                    test: ''
                }
            }
        }
    }
    render() {
        const { formData } = this.state
        return <div>
            <JSXForm value={formData} onChange={data => console.log(data)}>
                <Input v-model="param.name" />
                <div>
                    <Input v-model="param.test" />
                </div>
            </JSXForm>
        </div>
    }
}