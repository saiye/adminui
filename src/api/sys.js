import request from 'utils/request'

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

export function addUser() {
    return request({
        url: '/main/sys/add-user',
        method: 'post'
    })
}

export function editUser() {
    return request({
        url: '/main/sys/edit-user',
        method: 'post'
    })
}

export function lockUser() {
    return request({
        url: '/main/sys/lock-user',
        method: 'post'
    })
}

export function userList() {
    return request({
        url: '/main/sys/user-list',
        method: 'get'
    })
}

export function editAct() {
    return request({
        url: '/main/sys/edit-act',
        method: 'get'
    })
}
