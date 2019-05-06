import React from 'react'
import { Button, Icon, Input, Select, Radio } from 'antd';
import { address} from './testData'
import JSXForm from '../../../src'
import './index.less'

const TextArea = Input.TextArea
const RadioGroup = Radio.Group
const Option = Select.Option

export default class Base extends React.Component {
    constructor() {
        super()
        this.state = {
            outputData: {}
        }
    }
    render() {
        const provinces = Object.keys(address)
        return <div>
            <JSXForm 
                className="base-form-area"
                onChange={(valid, data) => console.log(data)}>
                <Select 
                    v-model="province" 
                    v-label="省份" 
                    onChange={value => {
                        const cities = address[value]
                        const citieList = Object.keys(cities)
                        const defaultCity = citieList[0]
                        const towns = cities[defaultCity] || []
                        _self.setValue({
                            '_assistData.cities': citieList,
                            '_assistData.towns': towns,
                            'city': defaultCity,
                            'town': towns[0],
                        })
                    }}>
                    <Option v-for="provItem in {provinces}" value={provItem}>{provItem}</Option>
                </Select>
                <Select 
                    v-model="city" 
                    v-label="城市" 
                    onChange={value => {
                        const cities = address[_self.getValue('city')] || {}
                        const towns = cities[value] || []
                        _self.setValue('_assistData.towns', towns)
                    }}>
                    <Option v-for="cityItem in _assistData.cities" v-init={['请先选择省份']} value={cityItem}>{cityItem}</Option>
                </Select>
                <Select v-model="town" v-label="城区/县">
                    <Option v-for="cityItem in _assistData.towns" v-init={['请先选择城区']} value={cityItem}>{cityItem}</Option>
                </Select>
            </JSXForm>
            <span>表单输出结果：</span>
            <pre>
                {/* <code>{JSON.stringify(this.state.outputData)}</code> */}
            </pre>
        </div>
    }
}