const commonFn = require('../commonFn')
const { removeMarks, getKeyList } = commonFn

module.exports = (curProp, newProp, option) => {
    const vfor = removeMarks(curProp.props['v-for'].trim())
    const forReg = /\((.*),(.*)\)/g
    const loopReg = /\{(.*)\}/g
    if(!vfor.includes('in')){
        console.error('v-for指令语法错误')
    }
    let index = 'index'
    let item = vfor.split(/\bin\b/)[0].trim()
    let loopVar = vfor.split(/\bin\b/)[1].trim()
    // 提取v-for指令的多个变量
    const match = forReg.exec(item)
    if(match){
        item = match[1]
        index = match[2]
    }
    // 判断v-for是否是变量
    const varMatch = loopReg.exec(loopVar)
    if(varMatch){
        loopVar = varMatch[1].trim()
    }
    newProp.loopEle = {
        loopVar,
        index,
        item,
        isStateVar: !!varMatch,
        initValue: curProp.props['v-init'],
        globalRefresh: option.eleName === 'Option'
    }
    // 添加v-for变量信息
    option.loopInfo = {
        item,
        loopVar,
        index,
    }
}