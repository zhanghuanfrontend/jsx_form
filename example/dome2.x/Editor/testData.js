// export const codeExample = `<JSXForm labelWidth={40} localUpdate={false}>
//     <Input v-model="name" v-label="名称" />
//     <Input v-model="age" v-label="年龄" />
//     <Button type="primary" style={{width: 100}}>提交</Button>
// </JSXForm>
// `

export const codeExample = `<JSXForm>
<Input name={['test']} v-total={['os', '操作系统']}/>
</JSXForm>`



export const osList = [
    'iOS',
    'Android',
    '服务端',
    'Wap端',
    'Web',
    'Mac'
]

export const typeList = ['string', 'integer', 'float']


export const paramList = [
    {
        name: 'start_duration',
        type: 'integer',
        desc: '整体时延'
    },
    {
        name: 'is_ad',
        type: 'string',
        desc: '搜索结果卡片为广告'
    },
    {
        name: 'is_surfaceview',
        type: 'integer',
        desc: 'is_surfaceview'
    },
    {
        name: 'playURL',
        type: 'string',
        desc: '当前播放URL'
    },
    {
        name: 'errorDesc',
        type: 'string',
        desc: '错误描述'
    },
    {
        name: 'errorCode',
        type: 'integer',
        desc: '错误码'
    },
    {
        name: 'service',
        type: 'string',
        desc: '打点时机'
    },
    {
        name: 'merchant_event_id',
        type: 'string',
        desc: '抖店商家的活动id'
    },
    {
        name: 'list_type',
        type: 'string',
        desc: '邀请好友类型'
    },
    {
        name: 'triggered_in_app_rating',
        type: 'string',
        desc: '好评弹窗提交模拟评分后，判断是否成功吊起了 iOS 的 in-app rating 功能'
    },
    {
        name: 'is_oncemore',
        type: 'string',
        desc: '是否再来一局'
    },
]