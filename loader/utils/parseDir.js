const { vmodelParse, vforParse, vshowParse } = require('./directive/index.js')
const commonFn = require('./commonFn')

const { getParamList, removeMarks } = commonFn
// 解析指令
const parseDirective = (dir, curProp, newProp, option) => {
    switch(dir) {
        case 'v-model':
            return vmodelParse(curProp, newProp, option)
        case 'v-for':
            return vforParse(curProp, newProp, option)
        case 'v-show':
            return vshowParse(curProp, newProp, option)
    }
}

const parseComponent = (curProp, newProp, option) => {
    const keys = Object.keys(curProp.props)
    keys.forEach(key => {
        if(key.indexOf('v-') === 0){
            parseDirective(key, curProp, newProp, option)
        }else{
            newProp.props[key] = curProp.props[key]
        }
    })
}

// 提取出指令及其值
const parseProps = (props) => {
    if(!props){
        return {}
    }
    const propsStr = props.trim().slice(1, -1)
    const propList = getParamList(propsStr)
    const propObj = {}
    propList.forEach(item => {
        let key = item.trim()
        let value = true
        if(item.includes(':')){
            const props = getParamList(item, ':')
            key = removeMarks(props[0].trim())
            value = props[1].trim()
            propObj[key] = value
        }
    })
    return propObj
}

// 拼接props
const getPropStr = (props) => {
    let propStr = ''
    const keys = Object.keys(props)
    keys.forEach(key => {
        if(key && props[key]){
            propStr += `${key}: ${props[key]}, `
        }
    })
    return `{${propStr}}`
}

// 包装子元素
const wrapChildren = (type = 'origin', children, option) => {
    switch(type) {
        case 'origin':
            return children
        case 'global':
            const JSXForm = option.JSXFormName
            return `<${JSXForm}.JSXFormGlobalData.Consumer>
            {_self => ${children}}
            </${JSXForm}.JSXFormGlobalData.Consumer>`
    }
}

// 拼接出React Element
const getReactElement = (newProp, option) => {
    const JSXForm = option.JSXFormName
    let reactComp = `React.createElement(
        ${newProp.eleName},
        ${getPropStr(newProp.props)},
        ${wrapChildren(newProp.eleName === JSXForm ?
            'global' : 'origin',
            option.parseReact(newProp.children, option), option)}
    )`
    // 如果存在父级元素
    if(newProp.parent && newProp.parent.eleName){
        reactComp = `React.createElement(
            ${newProp.parent.eleName},
            ${getPropStr(newProp.parent.props)},
            ${reactComp}
        )`
    }
    // 如果存在循环展现的元素
    if(newProp.loopEle && newProp.loopEle.loopVar){
        const loopObj = newProp.loopEle || {}
        reactComp =  `<${JSXForm}.FormItem dataKey="${loopObj.loopVar}" initValue={${loopObj.initValue}}>
        {
            (mapData, mapKey) => 
            (mapData || []).map((${loopObj.item}${loopObj.index ? `,${loopObj.index}` : ''}) => {
                return ${reactComp}
            })
        }
        </${JSXForm}.FormItem>`
    }
    // 如果有c-show指令
    if(newProp.vShow){
        reactComp = `
            (${newProp.vShow}) && ${reactComp}
        `
    }
    return reactComp
}


module.exports = (eleName, props, children, option) => {
    const { parseReact } = option
    const propObj = parseProps(props)
    // 当前组件的描述
    const curProp = {   
        props: propObj,
    }
    // 解析后组件的描述
    const newProp = {
        props: {},
        children,
        eleName,
    }   
    parseComponent(curProp, newProp, option)
    return getReactElement(newProp, option)
}