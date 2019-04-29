const commonFn = require('../commonFn')
const { removeMarks, getKeyList } = commonFn

module.exports = (curProp, newProp, option) => {
    const vfor = removeMarks(curProp.props['v-for'].trim())
    const forReg = /^\((.*)\)\s+in\s+(.*)$/g
    const forMatch = forReg.exec(vfor)
    if(!forMatch){
        console.error('v-for指令语法错误')
        return
    }
    const loopVar = forMatch[2].trim()
    let item = forMatch[1].trim()
    let index = null
    if(item.includes(',')){
        const vars = item.split(',')
        item = vars[0].trim()
        index = vars[1].trim()
    }
    newProp.loopEle = {
        loopVar,
        index,
        item,
    }
    // 添加v-for变量信息
    option.loopInfo = {
        item,
        loopVar,
        index,
    }
}