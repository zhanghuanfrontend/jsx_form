import React from 'react'
import NormalForm from './NormalForm'
import JSXForm2 from './JSXForm2'
import JSXForm1 from './JSXForm1'
import Echarts from './Echarts'
import { Input, Button } from 'antd'
import './index.less'

export default class Performance extends React.Component {
    constructor(){
        super()
        this.state = {
            formLen: 1
        }
        this.time = 0
        this.data = []
        this.NormalForm = React.createRef()
        this.JSXForm2 = React.createRef()
        this.JSXForm1 = React.createRef()
        this.echarts = React.createRef()
    }
    updateFormItem = () => {
        this.data.push(new Array(3).fill(-1))
        this.NormalForm.current.update()
        this.JSXForm2.current.update()
        this.JSXForm1.current.update()
    }
    beginTest = () => {
        this.updateFormItem()
    }
    updateData = (idx, time) => {
        const len = this.data.length
        const lastData = this.data[len - 1]
        lastData[idx] = time
        if(lastData.every(item => item !== -1)){
            // render折线图
            lastData[3] = this.state.formLen
            this.echarts.current.renderEcharts(this.data)
            this.setState({formLen: this.state.formLen + 50})
            setTimeout(() => {
                this.time++
                if(this.time < 100){
                    this.updateFormItem()
                }
            }, 100)
        }
    }
    render() {
        const { formLen } = this.state
        return <div className="test-area">
            <div className="test-wrap">
                <div className="performance-test">
                    <div className="form-area normal-form-area">
                        <NormalForm formLen={formLen} ref={this.NormalForm} updateData={time => this.updateData(0, time)} />
                    </div>
                    <div className="form-area normal-form-area">
                        <JSXForm2 formLen={formLen} ref={this.JSXForm2} updateData={time => this.updateData(1, time)} />
                    </div>
                    <div className="form-area normal-form-area">
                        <JSXForm1 formLen={formLen} ref={this.JSXForm1} updateData={time => this.updateData(2, time)} />
                    </div>
                </div>
            </div>
            <Button type="primary" className="begin-test" onClick={this.beginTest}>开始测试</Button>
            <Echarts ref={this.echarts} />
        </div>
    }
}