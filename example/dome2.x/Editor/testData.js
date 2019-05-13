// export const codeExample = `<JSXForm labelWidth={40} localUpdate={false}>
//     <Input v-model="name" v-label="名称" />
//     <Input v-model="age" v-label="年龄" />
//     <Button type="primary" style={{width: 100}}>提交</Button>
// </JSXForm>
// `

export const codeExample = `<JSXForm 
value={{
    paramList: [
        {name: '1'},
        {name: '2'},
        {name: '3'},
    ]
}} 
labelWidth={60}
onChange={(valid, data) => {}}>
<div v-for="(item, index) in paramList">
    <Input v-model="item.name" v-label="名称" />
    <div className="add-btn" 
        v-show={index === _self.getValue('paramList').length - 1} 
        onClick={() => {
            const list = _self.getValue('paramList')
            list.push({
                name: '测试123',
                os: '234'
            })
            _self.setValue('paramList', list)
        }
    }>+</div>
    <div className="delete-btn" 
        v-show={index !== 0}
        onClick={() => {
            const list = _self.getValue('paramList')
            list.splice(index, 1)
            _self.setValue('paramList', list)
        }
    }>
        <Icon theme="filled" type="delete" />
    </div>
</div>
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