// export const codeExample = `<JSXForm labelWidth={40} localUpdate={false}>
//     <Input v-model="name" v-label="名称" />
//     <Input v-model="age" v-label="年龄" />
//     <Button type="primary" style={{width: 100}}>提交</Button>
// </JSXForm>
// `

export const codeExample = `<JSXForm 
className="base-form-area"
onChange={(valid, data) => console.log(data)}>
<Select 
    v-model="province" 
    v-label="省份" 
    onChange={value => {
        const cities = address[value]
        const citieList = Object.keys(cities)
        const defaultCity = citieList[0]
        const towns = cities[defaultCity] || []
        _self.setValue({
            '_assistData.cities': citieList,
            '_assistData.towns': towns,
            'city': defaultCity,
            'town': towns[0],
        })
    }}>
    <Option v-for="provItem in {provinces}" value={provItem}>{provItem}</Option>
</Select>
<Select 
    v-model="city" 
    v-label="城市" 
    onChange={value => {
        const cities = address[_self.getValue('city')] || {}
        const towns = cities[value] || []
        _self.setValue('_assistData.towns', towns)
    }}>
    <Option v-for="cityItem in _assistData.cities" v-init={['请先选择省份']} value={cityItem}>{cityItem}</Option>
</Select>
<Select v-model="town" v-label="城区/县">
    <Option v-for="cityItem in _assistData.towns" v-init={['请先选择城区']} value={cityItem}>{cityItem}</Option>
</Select>
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