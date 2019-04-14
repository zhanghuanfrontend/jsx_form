import React from 'react'
import {Dynamic, Base, FormItem} from './dome'
import { Menu } from 'antd'

export default class Main extends React.Component {
    constructor(){
        super()
        this.state = {
            curMenu: 'formItem'
        }
    }
    renderComponent = () => {
        const {curMenu} = this.state
        switch(curMenu){
            case 'base':
                return <Base />
            case 'dynamic':
                return <Dynamic />
            case 'formItem': 
                return <FormItem />
                return 
        }
    }
    render() {
        const {curMenu} = this.state
        const menuList = [
            { name: '基本表单', key: 'base'},
            { name: '增减表单', key: 'dynamic'},
            { name: '表单组件', key: 'formItem'},
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