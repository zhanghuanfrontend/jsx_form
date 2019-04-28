import React from 'react'
import JSXForm from '../../../src'
import { Input, Button } from 'antd'
import './index.less'


export default class Main extends React.Component {
    constructor(){
        super()
        this.state = {
            formData: {
                param: {
                    name: 'btn-click',
                    test: '234'
                }
            }
        }
    }
    render() {
        const { formData } = this.state
        return <div className="base-form-area">
            <JSXForm 
                value={formData} 
                labelWidth={40}
                onChange={(valid, data) => console.log(valid, data)}>
                <Input 
                    v-model="param.name"
                    v-label="Param名称"
                    v-label-width={80}
                    v-class="param-name"
                    v-validate={['required', /^[^\d]*$/g]}
                />
                <Input 
                    v-model="param.test"
                    v-label="描述"
                     />
            </JSXForm>
            <Button type="primary" onClick={() => {
                this.setState({
                    formData: {
                        ...formData,
                        param: {
                            ...formData.param,
                            name: 'test1'
                        }
                    }
                })
            }}>修改数据</Button>
        </div>
    }
}