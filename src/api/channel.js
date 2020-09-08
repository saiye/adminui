import request from '@/tools/request'

export function channelList(data) {
    return request({
        url: 'game/channel/channelList',
        method: 'post',
        data
    })
}

export function addChannel(data) {
    return request({
        url: 'game/channel/addChannel',
        method: 'post',
        data
    })
}

export function editChannel(data) {
    return request({
        url: 'game/channel/editChannel',
        method: 'post',
        data
    })
}

export function delChannel(data) {
    return request({
        url: 'game/channel/delChannel',
        method: 'post',
        data
    })
}