import React from 'react'
import CodeMirror from 'codemirror'
import { Button, Icon, Input } from 'antd';
import SyntaxHighlighter from 'react-syntax-highlighter'
import { codeExample } from './testData'
import JSXFormLoader from 'loader/browser.js'
import 'codemirror/lib/codemirror.css'
import 'codemirror/theme/monokai.css'
import 'codemirror/addon/display/fullscreen.css'
import './index.less'

const res = React.createElement('div', {}, null)
console.log(res)

export default class Editor extends React.Component {
    constructor(){
        super()
        this.state = {
            codeString: '',
            reactElement: null,
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
            theme: 'monokai',      // 使用monokai模版
        });
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
            console.log(ReactEle)
            this.setState({codeString: parseCode, reactElement: ReactEle})
        }
    }
    render() {
        const {codeString, reactElement} = this.state
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
            <div className="parsed-code-display">
                <SyntaxHighlighter language='javascript'>
                    {codeString}
                </SyntaxHighlighter>
            </div>
        </div>
    }
}
