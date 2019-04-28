import React from 'react'
import JSXForm from '../../../src'
import { Input, Select, Button, Icon, Radio } from 'antd';
import './index.less'

export default class Game extends React.Component {
    constructor(){
        super()
        this.state = {
            formData: {
                game: {
                    a: '',
                    b: '',
                    c: '',
                    cheat: false
                },
                results: ''
            }
        }
    }
    countResult = () => {
        const {formData} = this.state
        let results = ''
        const keys = ['a', 'b', 'c']
        const names = {
            a: '自己',
            b: '路人甲',
            c: '土匪丁'
        }
        if(formData.game.a === '主角无敌'){
            results += '自己 赢了 所有\n'
        }
        keys.forEach((key, idx) => {
            const other = keys.filter(curkey => curkey !== key)
            other.forEach(subKey => {
                if((formData.game[key] + 1) % 4 === formData.game[subKey]){
                    results += `${names[key]} 赢了 ${names[subKey]}；`
                }
            })
        })
        results = results || '这局平局'
        this.setState({formData: {...formData, results,}})
    }
    render() {
        const {formData} = this.state
        const gameList = [
            {name: '棒棒', key: 0},
            {name: '虎', key: 1},
            {name: '鸡', key: 2},
            {name: '虫', key: 3},
        ]
        const watch = {
            'game.a': (prev, curr) => {
                const {formData} = this.state
                const value = [0, 1, 2, 3]
                const bValue = Math.floor(Math.random() * 4)
                const cValue = Math.floor(Math.random() * 4)
                let aValue = curr
                if(formData.game.cheat){
                    const newValue = value.filter(item => {
                        return item !== bValue && item !== cValue && item !== (bValue + 1) % 4 && item !== (cValue + 1) % 4
                    })
                    aValue = newValue[0] || '主角无敌'
                }
                this.setState({
                    formData: {
                        ...formData,
                        game: {
                            ...formData.game,
                            a: aValue,
                            b: bValue,
                            c: cValue
                        }
                    }
                }, this.countResult)
            }
        }
        const gameOptions = gameList.map(item => <Option key={item.key} value={item.key}>{item.name}</Option>)
        return <div className="game-area">
            <JSXForm 
                value={formData}
                watch={watch}
                onChange={data => this.setState({formData: data})}
            >
                <Select v-model="game.a" v-label="自己">
                    {gameOptions}
                </Select>
                <Select v-model="game.b" v-label="路人甲" disabled>
                    {gameOptions}
                </Select>
                <Select v-model="game.c" v-label="土匪丁" disabled>
                    {gameOptions}
                </Select>
                <Select v-model="game.cheat" v-label="是否作弊">
                    <Option value={true}>主角光环</Option>
                    <Option value={false}>公平、公正、公开</Option>
                </Select>
                <div>结果：{formData.results}</div>
            </JSXForm>
        </div>
    }
}