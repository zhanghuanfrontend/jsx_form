
import { execDirective } from '../commonFn'

export default (key, element, options) => {
    const dir = element.props[key]
    const dirValue = execDirective(dir, options.formData)
    const attr = key.replace('v-$', '')
    element.props[attr] = dirValue
}