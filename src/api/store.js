import request from '@/tools/request'

export function storeList(data) {
    return request({
        url: '/store/Index/storeList',
        method: 'post',
        data
    })
}

export function addStore(data) {
    return request({
        url: '/store/Index/addStore',
        method: 'post',
        data
    })
}

export function checkStore(data) {
    return request({
        url: '/store/Index/checkStore',
        method: 'post',
        data
    })
}