import request from '@/tools/request'

export function storeList(data) {
    return request({
        url: '/store/index/storeList',
        method: 'post',
        data
    })
}

export function addStore(data) {
    return request({
        url: '/store/index/addStore',
        method: 'post',
        data
    })
}

export function checkStore(data) {
    return request({
        url: '/store/index/checkStore',
        method: 'post',
        data
    })
}

export function editStore(data) {
    return request({
        url: '/store/index/editStore',
        method: 'post',
        data
    })
}
export function storeTagList(data) {
    return request({
        url: '/store/index/tagList',
        method: 'post',
        data
    })
}
export function closeStore(data) {
    return request({
        url: '/store/index/closeStore',
        method: 'post',
        data
    })
}