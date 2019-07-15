import request from './request'
const basePath = process.env.NODE_ENV === 'development' 
    ? '' 
    : `https://data.bytedance.net`

export const getAppList = () => {
    const url = `${basePath}/et_api/v1/api/misc/index_app`;
    return request(url);
};

export const getSubAppList = (appId) => {
    const url = `${basePath}/et_api/v1/api/misc/index_sub_app?app_id=${appId}`;
    return request(url);
};