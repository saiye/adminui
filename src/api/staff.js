import request from 'utils/request'

export function staffList(data) {
    return request({
        url: '/staff/Index/staffList',
        method: 'post',
        data
    })
}