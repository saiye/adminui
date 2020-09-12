import request from '@/tools/request'

export function configList(data) {
    return request({
        url: '/main/set/getList',
        method: 'post',
        data
    })
}

export function addConfig(data) {
    return request({
        url: '/main/set/add',
        method: 'post',
        data
    })
}
export function editConfig(data) {
    return request({
        url: '/main/set/edit',
        method: 'post',
        data
    })
}

export function putFile(data) {
    return request({
        url: '/main/set/putFile',
        method: 'post',
        data
    })
}
export function sendSmsList(data) {
    return request({
        url: '/main/set/sendSmsList',
        method: 'post',
        data
    })
}
export function areaList(data) {
    return request({
        url: '/main/set/areaList',
        method: 'post',
        data
    })
}
export function addArea(data) {
    return request({
        url: '/main/set/addArea',
        method: 'post',
        data
    })
}
export function editArea(data) {
    return request({
        url: '/main/set/editArea',
        method: 'post',
        data
    })
}

