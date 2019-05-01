import React from 'react'
import { Button, Icon, Input }  from 'antd';
import JSXForm from '../../../src'
import './index.less'

export default class Editor extends React.Component {
    constructor(){
        super()
        this.JSXForm1 = React.createRef()
        this.JSXForm2 = React.createRef()
    }
    render() {
        return <div>
            <div className="results-area">
                <JSXForm ref={this.JSXForm1} value={{
                    list: [
                        {
                            name: 'money'
                        }
                    ]
                }}  
                    watch={{
                        'paramList.0.type': (prev, curr) => {
                            console.log(prev, curr)
                        }   
                    }}
                labelWidth={50} onChange={(valid, value) => console.log(value)}>
                    <Input v-model="name" v-label="name1" v-init="test" />
                    <Input v-model="param.name" 
                        v-label="name2" 
                        v-init={{name1: '123', name2: '345'}}  
                        v-packing={{
                            input: curValue => {
                                const keys = Object.keys(curValue)
                                let displayStr = ''
                                keys.forEach(key => {
                                    displayStr += `${key}${typeof curValue[key] !== 'undefined' ? `=${curValue[key]},` : ''}`
                                })
                                return displayStr
                            },
                            output: (curValue) => {
                                const arr = curValue.split(',')
                                const outputVal = {}
                                arr.forEach(item => {
                                    let key = item
                                    let value = undefined
                                    if(item.includes('=')){
                                        key = item.split('=')[0]
                                        value = item.split('=')[1]
                                    }
                                    outputVal[key] = value
                                })
                                return outputVal
                            }
                        }}
                        onChange={() => {
                            _self.setValue('list.0.name', 'linkage')
                        }} />
                    <Input v-model="list.0.name" v-label="name2" />
                    <div v-for="(item, index) in paramList" v-init={[{type: 'name'}]}>
                        <Input v-model="item.type" />
                    </div>
                </JSXForm>
            </div>
            <div className="other-show">
                <JSXForm labelWidth={50} 
                watch={{
                    'list.0.name': () => {
                        this.JSXForm1.current.watch('list.0.name', (prev, curr) => {
                            console.log(prev, curr, 'aaa')
                        })
                    }
                }}
                ref={this.JSXForm2}>
                    <Input v-model="name" v-label="name1" v-init="test" />
                    <Input v-model="param.name" v-label="name2" onChange={() => {
                        _self.setValue('list.0.name', 'linkage')
                    }} />
                    <Input v-model="list.0.name" v-label="name2" />
                    <div v-for="(item, index) in paramList" v-init={[{type: 'name'}]}>
                        <Input v-model="item.type" />
                    </div>
                </JSXForm>
            </div>
        </div>
    }
}