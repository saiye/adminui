import request from '@/tools/request'

export function logError(data) {
    return request({
        url: '/main/log/error',
        method: 'post',
        data
    })
}

export function getLogList(token) {
    return request({
        url: 'main/log/log',
        method: 'post',
        params: {token}
    })
}

export function actionLogList() {
    return request({
        url: '/main/log/action-log-list',
        method: 'post'
    })
}

export function loginLogList() {
    return request({
        url: 'main/log/login-log-list',
        method: 'post'
    })
}


