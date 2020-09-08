import request from '@/tools/request'

export function companyAndRoomList(data) {
    return request({
        url: '/room/index/companyAndRoomList',
        method: 'post',
        data
    })
}

export function addRoom(data) {
    return request({
        url: '/room/index/addRoom',
        method: 'post',
        data
    })
}
export function editRoom(data) {
    return request({
        url: '/room/index/editRoom',
        method: 'post',
        data
    })
}

export function roomList(data) {
    return request({
        url: '/room/index/roomList',
        method: 'post',
        data
    })
}

export function channelList(data) {
    return request({
        url: '/room/index/channelList',
        method: 'post',
        data
    })
}


