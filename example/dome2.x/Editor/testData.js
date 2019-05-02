// export const codeExample = `<JSXForm labelWidth={40} localUpdate={false}>
//     <Input v-model="name" v-label="名称" />
//     <Input v-model="age" v-label="年龄" />
//     <Button type="primary" style={{width: 100}}>提交</Button>
// </JSXForm>
// `

export const codeExample = `<JSXForm 
onChange={(valid, data) => console.log(data)}
>
<Input v-model="param" v-label="param:" v-validate={['required', /^[a-zA-Z_]+$/g]} />
<Select v-model="os" allowClear v-label="操作系统" v-validate={['required']}>
    <Option v-for="(osItem, idx) in {osList}" key={osItem} value={osItem}>{osItem}</Option>
</Select>
<RadioGroup v-label="类型:" v-model="type">
    <Radio v-for="typeItem in {typeList}" key={typeItem} value={typeItem}>{typeItem}</Radio>
</RadioGroup>
<TextArea v-label="描述" v-model="desc" rows="3"></TextArea>
<Button className="submit-btn" type="primary">提交</Button>
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