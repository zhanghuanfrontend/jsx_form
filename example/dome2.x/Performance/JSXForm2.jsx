import React from 'react'
import JSXForm from '../../../src'
import { Input, Button, Icon } from 'antd'
import './index.less'

export default class Main extends React.Component {
    constructor(props){
        super()
        const formLen = props.formLen
        const formArr = new Array(formLen).fill('')
        this.state = {
            param: {
                nameArr: formArr
            }
        }
    }
    componentWillReceiveProps(nextProps){
        if(nextProps.formLen && nextProps.formLen !== this.state.formLen){
            const formLen = nextProps.formLen
            const formArr = new Array(formLen).fill('')
            this.setState({param: {nameArr: formArr }})
        }
    }
    componentWillUpdate(preProps, nextProps, c, d){
        if(preProps.formLen === this.props.formLen){
            this.time = Date.now()
        }else{
            this.time = undefined
        }
    }
    componentDidUpdate(){
        if(this.time){
            const { updateData } = this.props
            const time = Date.now() - this.time
            updateData && updateData(time)
        }
    }
    update = () => {
        const { nameArr } = this.state.param
        const { formLen } = this.props
        nameArr[formLen - 1] = `test`
        this.setState({
            param: {
                nameArr,
            }
        })
    }
    render() {
        const { param } = this.state
        return <div className="base-test-form-area">
            <JSXForm 
                ref={this.JSXForm}
                value={param}>
                <div v-for="(item, index) in nameArr">
                    <Input v-model='item' v-label={`输入框${index}`} />
                </div>
            </JSXForm>
        </div>
    }
}