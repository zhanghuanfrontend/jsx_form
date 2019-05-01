import React from 'react'
import CodeMirror from 'codemirror'
import { Button, Icon, Input }  from 'antd';
import JSXForm from 'src/index.js'
import SyntaxHighlighter from 'react-syntax-highlighter'
import { codeExample } from './testData'
import JSXFormLoader from 'loader/browser.js'
import 'codemirror/lib/codemirror.css'
import 'codemirror/theme/tomorrow-night-eighties.css'
import 'codemirror/mode/htmlmixed/htmlmixed.js'
import 'codemirror/addon/display/fullscreen.css'
import './index.less'
const res = React.createElement('div', {}, null)

export default class Editor extends React.Component {
    constructor(){
        super()
        this.state = {
            codeString: '',
            reactElement: null,
            curDisplayCode: 'jsx',
        }
    }
    componentDidMount(){
        this.editor = CodeMirror.fromTextArea(document.getElementById("code-editor"), {
            lineNumbers: true,     // 显示行数
            indentUnit: 4,         // 缩进单位为4
            styleActiveLine: true, // 当前行背景高亮
            matchBrackets: true,   // 括号匹配
            mode: 'htmlmixed',     // HMTL混合模式
            lineWrapping: true,    // 自动换行
            theme: 'tomorrow-night-eighties',      // 使用monokai模版
        });
    }
    componentDidCatch(err){
        console.log(err)
    }
    parseDir = () => {
        const code = this.editor.getValue()
        const parseCode = JSXFormLoader.parse(code)
        if(parseCode){
            const dependence = {
                Input,
                Button,
            }
            const ReactEle = JSXFormLoader.parseReact(parseCode, dependence)
            this.setState({codeString: parseCode, reactElement: ReactEle})
        }
    }
    // 解读名字
    readJSXName = (element) => {
        const type = element.type
        if(typeof type === 'string'){
            return type
        }else if(type === JSXForm){
            return 'JSXForm'
        }else if(type === JSXForm.JSXFormGlobalData.Consumer){
            return 'JSXForm.JSXFormGlobalData.Consumer'
        }else if(type === JSXForm.FormItem){
            return 'JSXForm.FormItem'
        }else if(type === Input){
            return 'Input'
        }else if(type === Button){
            return 'Button'
        }
        return 'undefined'
    }
    // 解读props
    readProps = (reactElement, indentStr) => {
        const props = reactElement.props
        let curIndent = `${indentStr}    `
        let propsStr = ''
        const keys = Object.keys(props)
        keys.forEach(key => {
            if(key === 'children'){
                return
            }
            const symbol = typeof props[key] === 'undefined' ? '' : '='
            let value = typeof props[key] === 'undefined' ? '' : props[key]
            value = typeof value === 'string' ? `"${value}"` : `{${value}}`
            propsStr += `\n${curIndent}${key}${symbol}${value}`
        })
        return propsStr ? propsStr + `\n${indentStr}` : ''
    }
    // 将ReactElement转化为JSX
    transformReactToJSX = (reactElement, option) => {
        // 解读缩进
        let indentStr = ''
        for(let i = 0; i < option.indent; i++){
            indentStr += '    '
        }
        if(!reactElement || !(reactElement instanceof Object)){
            return reactElement ? reactElement : ''
        }else if(Array.isArray(reactElement)){
            const curIndent = option.indent
            return reactElement.map(subElement => this.transformReactToJSX(subElement, {indent: curIndent}))
        }else if(reactElement.$$typeof && reactElement.$$typeof.toString() === 'Symbol(react.element)'){
            const props = reactElement.props
            const displayName = this.readJSXName(reactElement)
            const propsStr = this.readProps(reactElement, indentStr)
            option.indent++
            const childrenContent = this.transformReactToJSX(props.children, option)
            let elementStr = `\n${indentStr}<${displayName}${propsStr} />`
            if(childrenContent){
                elementStr = `\n${indentStr}<${displayName}${propsStr}>${childrenContent}\n${indentStr}</${displayName}>`
            }
            return elementStr
        }else if(reactElement instanceof Function){
            const keys = Object.keys(reactElement)
            const children = reactElement()
            const conIndent = `${indentStr}    `
            option.indent += 2
            return `\n${indentStr}(_self) => {\n${conIndent}return (${this.transformReactToJSX(children, option)}\n${conIndent})\n${indentStr}}`
        }
        
    }
    displayCodeStyle = () => {
        const { curDisplayCode, codeString, reactElement } = this.state
        if(curDisplayCode === 'react'){
            return codeString
        }
        if(!reactElement){
            return ''
        }
        // 递归解析
        const option = {
            indent: 0
        }
        const element = this.transformReactToJSX(reactElement, option)
        return element
    }
    render() {
        const {codeString, reactElement, curDisplayCode} = this.state
        const displayCode = [
            {title: 'React实例', key: 'react'},
            {title: 'JSX代码', key: 'jsx'},
        ]
        return <div className="online-parse-and-exec-area">
            <div className="code-editor-and-exec-area">
                <div className="code-editor-area">
                    <textarea id="code-editor" name="code">{codeExample}</textarea>
                </div>
                
                <div className="code-display-area">
                    <div className="form-area">
                        {reactElement}
                    </div>
                </div>
            </div>
            <div className="exec-code">
                <Button type="primary" className="exec-code-btn" onClick={this.parseDir}>执行代码</Button>
            </div>
            <div className="parse-code-header">
                {
                    displayCode.map(item => {
                        return <div 
                            onClick={() => this.setState({curDisplayCode: item.key})}
                            className={`tab ${curDisplayCode === item.key ? 'active' : ''}`}>{item.title}</div>
                    })
                }
            </div>
            <div className="parsed-code-display">
                <SyntaxHighlighter language='javascript'>
                    {this.displayCodeStyle()}
                </SyntaxHighlighter>
            </div>
        </div>
    }
}
