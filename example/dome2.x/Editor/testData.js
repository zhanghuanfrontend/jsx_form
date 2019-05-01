// export const codeExample = `<JSXForm labelWidth={40} localUpdate={false}>
//     <Input v-model="name" v-label="名称" />
//     <Input v-model="age" v-label="年龄" />
//     <Button type="primary" style={{width: 100}}>提交</Button>
// </JSXForm>
// `

export const codeExample = `<div><div className="results-area">
<JSXForm value={{
    list: [
        {
            name: 'money'
        }
    ]
}}  
    watch={{
        'paramList.0.type': (prev, curr) => {
            console.log(prev, curr)
        }   
    }}
labelWidth={50}>
    <Input v-model="name" v-label="name1" v-init="test" />
    <Input v-model="param.name" v-label="name2" onChange={() => {
        _self.setValue('list.0.name', 'linkage')
    }} />
    <Input v-model="list.0.name" v-label="name2" />
    <div v-for="(item, index) in paramList" v-init={[{type: 'name'}]}>
        <Input v-model="item.type" />
    </div>
</JSXForm>
</div>
<div>
    <JSXForm></JSXForm>
</div>
</div>`