import React from 'react'
import JSXForm from '../../../src'
import { Input, Button, Icon } from 'antd'
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
            },
            test: '123'
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
                <JSXForm.JSXFormGlobalData.Consumer>
                        {_self => {
                            return <JSXForm.FormItem dataKey="list">
                                {
                                    (mapData) => {
                                        return (mapData || []).map((item, idx) => {
                                            return <>
                                                <JSXForm.FormItem dataKey={`list.${idx}.param`}>
                                                    <Input />
                                                </JSXForm.FormItem>
                                                <div className="add-btn" onClick={() => {
                                                    const list = _self.getValue('list')
                                                    list.push({
                                                        param: '234',
                                                    })
                                                    _self.setValue('list', _self.cloneData(list))
                                                    this.setState({test: '12'})
                                                }}>+</div>
                                                <div className="delete-btn" onClick={() => {
                                                    const list = _self.getValue('list')
                                                    list.splice(idx, 1)
                                                    _self.setValue('list', _self.cloneData(list))
                                                    this.setState({test: '12'})
                                                }}>
                                                    <Icon theme="filled" type="delete" />
                                                </div>
                                            </>
                                        })
                                    }
                                }
                            </JSXForm.FormItem>
                        }}
                </JSXForm.JSXFormGlobalData.Consumer>
            </JSXForm>
        </div>
    }
}