import axios from 'axios'
// 发送埋点
function sendEvent(event) {
    if(!event || event.length === 0){
        return
    }
    const deviceId = event[0].user.user_unique_id
    const appId = event[0].header.app_id
    if(!appId || !deviceId){
        return 
    }
    const query = `?from=pc&app_id=${appId}&device_id=${deviceId}`
    axios({
        url: `https://data.bytedance.net/et_api/logview/web_verify/${query}`,
        method: 'POST',
        data: event
    })
}

// 修改popup的deviceId
function showDeviceId(event){
    if(!event || event.length === 0){
        return
    }
    const deviceId = event[0].user.user_unique_id
    const appId = event[0].header.app_id
    if(!appId){
        return
    }
    chrome.storage.sync.get({curPageInfo: {info: [], num: 0}}, (results) => {
        const pageInfo = results.curPageInfo || {}
        pageInfo.num++
        if(!pageInfo.info.some(item => item.appId === appId && item.deviceId === deviceId)){
            pageInfo.info.push({
                appId,
                deviceId,
            })
        }
        chrome.storage.sync.set({curPageInfo: pageInfo})
        chrome.browserAction.setBadgeText({text: String(pageInfo.num)})
        chrome.browserAction.setBadgeBackgroundColor({color: '#000'})
    })
}

// 处理请求
const dealRequest = (details) => {
    if(!details || !details.requestBody || !details.requestBody.raw){
        return
    }
    const eventStr = decodeURIComponent(
        details.requestBody.raw
          .map(data => {
            return new TextDecoder('utf-8').decode(data.bytes);
          })
          .join('')
      )
    let event = {}
    try {
        event = JSON.parse(eventStr) || {}
    }catch(err){
        console.log(err)
    }
    showDeviceId(event)
    sendEvent(event)
}

chrome.webRequest.onBeforeRequest.addListener(details => {
    chrome.storage.sync.get(['isOpenVerify'], (results) => {
        if(results.isOpenVerify){
            dealRequest(details)
        }
    })
}, {urls: ['*://mcs.snssdk.com/*']}, ["requestBody"])

// 离开当前tabs
chrome.tabs.onActivated.addListener(() => {
    chrome.storage.sync.set({curPageInfo: {}})
    chrome.browserAction.setBadgeText({text: ''})
})


