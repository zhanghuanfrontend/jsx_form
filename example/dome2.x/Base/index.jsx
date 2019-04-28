import React from 'react'
import JSXForm from '../../../src'
import { Input, Button } from 'antd'
import './index.less'

export default class Main extends React.Component {
    constructor(){
        super()
        this.state = {
            formData: {
                list: [
                    {
                        param: '123',
                    }
                ]
            }
        }
        this.JSXForm = React.createRef()
    }
    render() {
        const { formData } = this.state
        return <div className="base-form-area">
            <JSXForm 
                value={formData}
                labelWidth={40}
                ref={this.JSXForm}
                onChange={(valid, data) => {}}>
                <JSXForm.FormItem dataKey="list">
                    {
                        formData.list.map((item, idx) => {
                            return <>
                                <JSXForm.FormItem dataKey={`list.${idx}.param`}>
                                    <Input />
                                </JSXForm.FormItem>
                            </>
                        })
                    }
                    <div className="add-btn" onClick={() => {
                        const paramList = this.JSXForm.current.getValue('list')
                        paramList.push({
                            param: '234',
                        })
                        this.JSXForm.current.setValue('list', paramList)
                    }}>+</div>
                </JSXForm.FormItem>
            </JSXForm>
        </div>
    }
}