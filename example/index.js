import React from 'react'
import ReactDOM from 'react-dom'
import Main from './Main'
import "antd/dist/antd.less";
import './index.less'
import JSXForm from '../src'

JSXForm.directive('v-d-options', (Element, value) => {
    const [list = [], ReactElement] = value
    return <Element>
        {
            list.map(item => {
                let label = item, value = item
                if(item instanceof Object){
                    label = item.label || ''
                    value = item.value || ''
                }
                return <ReactElement key={value} value={value}>{label}</ReactElement>
            })
        }
    </Element>
})

JSXForm.directive('v-d-total', (Element, value) => {
    const [model, label, ...validate] = value
    const props = {
        'v-model': model,
        'v-label': label,
        'v-validate': validate
    } 
    return <Element {...props} />
})


ReactDOM.render(
    <Main />,
    document.getElementById('app')
)