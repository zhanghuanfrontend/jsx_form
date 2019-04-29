module.exports = (curProp, newProp, option) => {
    const vShow = curProp.props['v-show'] || true
    newProp.vShow = vShow
}