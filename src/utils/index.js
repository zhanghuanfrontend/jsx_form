export {
    cloneData, 
    getKeyValue,
    modifyKeyValue,
    deepCloneProps,
    execDirective,
} from './commonFn'
import parse from './parse'
import vmodelParse from './parseDirect/vmodel'
import vforParse from './parseDirect/vfor'
import vshowParse from './parseDirect/vshow'
import vlabelParse from './parseDirect/vlabel'
import vvalidateParse from './parseDirect/vvalidate'
import vclickParse from './parseDirect/vclick'
export {
    parse, 
    vmodelParse, 
    vforParse, 
    vshowParse, 
    vlabelParse, 
    vvalidateParse,
    vclickParse,
}