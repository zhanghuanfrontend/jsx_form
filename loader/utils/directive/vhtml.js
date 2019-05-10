module.exports = (curProp, newProp, option) => {
    const props = curProp.props || {}
    let html = props['v-html'] || []
    newProp.parent = {
        eleName: `${option.JSXFormName}.FormText`,
        props: {
            html,
            packing: props['v-packing'],
        }
    }
}