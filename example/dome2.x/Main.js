import React from 'react'
import {BaseForm, Dynamic, Editor, Results, Linkage, Performance} from './index'
import { Menu } from 'antd'

export default class Main extends React.Component {
    constructor(){
        super()
        this.state = {
            curMenu: 'linkage'
        }
    }
    renderComponent = () => {
        const {curMenu} = this.state
        switch(curMenu){
            case 'base':
                return <BaseForm />
            case 'dynamic':
                return <Dynamic />
            case 'editor': 
                return <Editor />
            case 'results':
                return <Results />
            case 'linkage':
                return <Linkage />
            case 'performance':
                return <Performance />
        }
    }
    render() {
        const {curMenu} = this.state
        const menuList = [
            { name: '基本表单', key: 'base'},
            { name: '增减表单', key: 'dynamic'},
            { name: '在线编辑', key: 'editor'},
            { name: '封装表单数据', key: 'results'},
            { name: '联动表单', key: 'linkage'},
            { name: '性能测试', key: 'performance'},
        ]
        
        return <div className="dome-area">
            <div className="left-side">
                <div className="left-side-top"></div>
                <div className="menu-area">
                    {
                        menuList.map(item => {
                            return <div 
                                onClick={() => this.setState({curMenu: item.key})}
                                key={item.key}
                                className={`menu-item ${curMenu === item.key ? 'active' : ''}`}
                            >
                                {item.name}
                            </div>
                        })
                    }
                </div>
            </div>
            <div className="container">{this.renderComponent()}</div>
        </div>
    }
}