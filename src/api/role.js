import request from '@/tools/request'

export function addRole(data) {
    return request({
        url: '/main/sys/add-role',
        method: 'post',
        data
    })
}

export function editRole(data) {
    return request({
        url: '/main/sys/edit-role',
        method: 'post',
        data
    })
}

export function deleteRole(data) {
    return request({
        url: '/main/sys/del-role',
        method: 'post',
        data
    })
}

export function getRoleItem(data) {
    return request({
        url: '/main/sys/edit-role',
        method: 'get',
        params: data
    })
}
export function roleList(data) {
    return request({
        url: '/main/sys/role-list',
        method: 'get',
        params: data
    })
}
