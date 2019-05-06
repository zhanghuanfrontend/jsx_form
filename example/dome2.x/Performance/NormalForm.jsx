import React from 'react'
import { Input } from 'antd'

export default class Performance extends React.Component {
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
        const { nameArr } = this.state.param
        return <div className="form-wrap">
            {
                nameArr.map((item, idx) => {
                    return <div className="form-group">
                        <span className="label">输入框{idx + 1}</span>
                        <div className="form-item">
                            <Input value={item} />
                        </div>
                    </div>
                })
            }
        </div>
    }
}