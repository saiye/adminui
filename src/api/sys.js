import request from '@/tools/request'

export function addRole(data) {
    return request({
        url: '/main/sys/add-role',
        method: 'post',
        data
    })
}

export function editRole(token) {
    return request({
        url: '/main/sys/edit-role',
        method: 'get',
        params: {token}
    })
}

export function delRole() {
    return request({
        url: '/main/sys/del-role',
        method: 'post'
    })
}

export function editAct() {
    return request({
        url: '/main/sys/edit-act',
        method: 'get'
    })
}
