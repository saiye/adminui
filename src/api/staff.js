import request from '@/tools/request'

export function staffList(data) {
    return request({
        url: '/staff/index/staffList',
        method: 'post',
        data
    })
}