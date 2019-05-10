const getParamList = require('../commonFn').getParamList
module.exports = (curProp, newProp, option) => {
    const props = curProp.props || {}
    let total = (props['v-total'] || '').replace(/\s/g, '').slice(1, -1)
    var params = getParamList(total)
    const [dataKey = '', label = undefined, ...validate] = params
    newProp.parent = {
        eleName: `${option.JSXFormName}.FormItem`,
        props: {
            dataKey,
            label,
            validate: validate || [],
        }
    }
}