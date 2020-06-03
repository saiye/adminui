import request from '../tools/request'

export function login(data) {
    return request({
        url: '/user/login',
        method: 'post',
        data
    })
}

export function logout() {
    return request({
        url: '/user/logout',
        method: 'post'
    })
}

export function getInfo(token) {
    return request({
        url: '/user/info',
        method: 'get',
        params: {token}
    })
}


export function addUser(data) {
    return request({
        url: '/main/sys/add-user',
        method: 'post',
        data
    })
}

export function editUser(data) {
    return request({
        url: '/main/sys/edit-user',
        method: 'post',
        data
    })
}

export function lockUser(data) {
    return request({
        url: '/main/sys/lock-user',
        method: 'post',
        data
    })
}

export function userList() {
    return request({
        url: '/main/sys/user-list',
        method: 'get'
    })
}

