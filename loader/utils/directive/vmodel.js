
// v-model指令，添加JSXForm.FormItem父组件
module.exports = (curProp, newProp, option) => {
    const props = curProp.props || {}
    let dataKey = props['v-model'] || ''
    if(option.loopInfo && option.loopInfo.item){
        const loopInfo = option.loopInfo || {}
        dataKey = dataKey.replace(loopInfo.item, `${loopInfo.loopVar}.\${${loopInfo.index}}`)
        dataKey = `\`${dataKey.slice(1, -1)}\``
    }
    newProp.parent = {
        eleName: `${option.JSXFormName}.FormItem`,
        props: {
            dataKey,
            label: props['v-label'] || '',
            labelWidth: props['v-label-width'],
            className: props['v-class'],
            validate: props['v-validate']
        }
    }
}