import React from 'react'
import Switch from 'antd/lib/switch'
import Table from 'antd/lib/table'
import FilterSelect from '../FilterSelect'
import { getAppList, getSubAppList } from 'apis'
import './index.less'

export default class Main extends React.Component {
    constructor(){
        super()
        const appId = Number(localStorage.getItem('__chrome_app_id')) || undefined
        const appListStr = localStorage.getItem('__chrome_app_list') || undefined
        const subAppListStr = localStorage.getItem('__chrome_sub_app_list') || undefined
        let appList = []
        let subAppList = []
        if(appListStr || subAppListStr){
            try {
                appList = appListStr ? JSON.parse(appListStr) : []
                subAppList = subAppListStr ? JSON.parse(subAppListStr) : []
            }catch (error){
                console.log(error)
            }
        }
        this.state = {
            checked: false,
            hintInfo: '暂无当前App的埋点，请先触发埋点上传，以方便我们收集数据',
            appList,
            subAppList,
            appId,
            address: []
        }
    }
    componentDidMount(){
        const {appList} = this.state
        if(appList.length === 0){
            this.getAppList()
        }
        this.initPage()
    }
    // 初始化页面
    initPage = () => {
        // 启动时，查看本地缓存是否开启验证
        chrome.storage.sync.get({isOpenVerify: false}, (results) => {
            this.setState({checked: results.isOpenVerify})
        })
        // 初始化显示deviceId和appId
        chrome.storage.sync.get({curPageInfo: {}}, (results) => {
            const curTab = results.curPageInfo || {}
            const { subAppList, appId } = this.state
            let finalEvent = curTab.info
            // 进行appId的过滤
            if(subAppList.length > 0){
                finalEvent = curTab.info.filter(item => subAppList.some(child => child.aid == item.appId))
            }
            if(Array.isArray(finalEvent) && finalEvent.length > 0){
                const msg = finalEvent.length > 1 ? `检测到多个项目的埋点，请选择正确的项目后，跳转到ET进行验证。` : ''
                this.setState({
                    hintInfo: '',
                    address: finalEvent.map((item, index) => {
                        return {
                            url: `https://data.bytedance.net/et/et-verification?appId=${item.appId}&deviceId=${item.deviceId}`,
                            deviceId: item.deviceId,
                            app: item.appId,
                        }
                    })
                })
            }else{
                this.setState({
                    hintInfo: '暂无当前App的埋点，请先触发埋点上传，以方便我们收集数据',
                    address: []
                })
            }
        })
    }
    // 获取app列表
    getAppList = () => {
        getAppList().then((res) => {
            const appList = res.data.appList || []
            this.setState({appList,})
            localStorage.setItem('__chrome_app_list', JSON.stringify(appList))
        })
    }
    // 获取sub App列表
    getSubAppList = () => {
        const { appId } = this.state
        if(appId){
            getSubAppList(appId).then((res) => {
                const subAppList = res.data || []
                this.setState({subAppList: subAppList}, this.initPage)
                localStorage.setItem('__chrome_sub_app_list', JSON.stringify(subAppList))
            })
        }
    }
    render() {
        const { checked, hintInfo = '', appList = [], appId, address = [] } = this.state
        const columns = [
            {
                title: 'deviceId',
                dataIndex: 'deviceId',
                className: 'long-th-area',
                key: 'deviceId',
            },
            {
                title: 'appId',
                dataIndex: 'app',
                className: 'long-th-area',
                key: 'app',
            },
            {
                title: '操作',
                key: 'operation',
                width: 34,
                render: (text, record) => {
                    return <a href={record.url} target="_blank">前往验证</a>
                }
            }
        ]
        return <div className="verify-area">
            <div className="title">埋点验证工具</div>
            <div className="form-item">
                <span className="label">开启验证</span>
                <Switch 
                    checked={checked}
                    checkedChildren="开" 
                    onChange={checked => {
                        this.setState({checked,})
                        chrome.storage.sync.set({isOpenVerify: checked})
                    }}
                    unCheckedChildren="关" />
                <FilterSelect
                    options={appList.map(item => ({
                        value: item.id,
                        label: item.name,
                        subValue: item.ename,
                    }))}
                    dropdownClassName="select-options"
                    dropdownStyle={{
                        fontSize: 12
                    }}
                    resultTotal={20}
                    placeholder="选择App"
                    allowClear={false}
                    allowSubFilter={true}
                    value={appId}
                    onChange={value => {
                        localStorage.setItem('__chrome_app_id', value)
                        this.setState({appId: Number(value) || undefined}, this.getSubAppList)
                    }}
                />
            </div>
            <div className="container">
                <div className="hint-info">{hintInfo}</div>
                <Table 
                    bordered={true} 
                    pagination={false} 
                    size="small"
                    locale={{
                        emptyText: '暂无埋点数据'
                    }}
                    dataSource={address} 
                    columns={columns} />
                <div className="footer">
                    <p>验证工具的使用方法：</p>
                    <ol>
                        <li>点击开启验证的开关，选择所在App</li>
                        <li>在页面中触发几次埋点上报，以便收集数据</li>
                        <li>点击"前往验证"，前往ET验证工具页</li>
                        <li>如果有多个App，注意选择所在App</li>
                    </ol>
                </div>
            </div>
        </div>
    }
}