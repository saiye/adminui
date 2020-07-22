import request from '@/tools/request'

export function addUser(data) {
    return request({
        url: '/game/index/addUser',
        method: 'post',
        data
    })
}

export function editUser(data) {
    return request({
        url: '/game/index/editUser',
        method: 'post',
        data
    })
}

export function lockUser(data) {
    return request({
        url: '/game/index/lockUser',
        method: 'post',
        data
    })
}

export function userList(data) {
    return request({
        url: '/game/index/userList',
        method: 'post',
        data
    })
}
export function setJudge(data) {
    return request({
        url: '/game/index/setJudge',
        method: 'post',
        data
    })
}

