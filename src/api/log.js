import request from '@/tools/request'

export function logError(data) {
    return request({
        url: '/main/log/error',
        method: 'post',
        data
    })
}

export function showLogData(data) {
    return request({
        url: '/main/log/show',
        method: 'post',
        data
    })
}

export function actionLogList(data) {
    return request({
        url: '/main/log/action-log-list',
        method: 'post',
        data
    })
}

