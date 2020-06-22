import request from '@/tools/request'

export function deviceList(data) {
    return request({
        url: 'room/device/deviceList',
        method: 'post',
        data
    })
}


