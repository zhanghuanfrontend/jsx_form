const getParamList = require('../commonFn').getParamList

module.exports = (curProp, newProp, option) => {
    const props = curProp.props || {}
    let total = (props['v-total'] || '').replace(/\s/g, '').slice(1, -1)
    var params = getParamList(total)
    const [model = '', label = undefined, ...validate] = params
    let dataKey = model
    if(option.loopInfo && option.loopInfo.item){
        const loopInfo = option.loopInfo || {}
        dataKey = dataKey.replace(loopInfo.item, `\${mapKey}.\${${loopInfo.index}}`)
        dataKey = `\`${dataKey.slice(1, -1)}\``
    }
    newProp.parent = {
        eleName: `${option.JSXFormName}.FormItem`,
        props: {
            dataKey,
            label,
            validate: validate || [],
            labelWidth: props['v-label-width'],
            className: props['v-class'],
            initValue: props['v-init'],
            packing: props['v-packing'],
        }
    }
}