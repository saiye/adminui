import request from '@/tools/request'


export function orderList(data) {
    return request({
        url: 'order/index/orderList',
        method: 'post',
        data
    })
}

export function orderDetail(data) {
    return request({
        url: 'order/index/detail',
        method: 'post',
        data
    })
}

export function setOrder(data) {
    return request({
        url: 'order/index/set',
        method: 'post',
        data
    })
}

export function addOrder(data) {
    return request({
        url: 'order/index/addOrder',
        method: 'post',
        data
    })
}


export function selectConf(data) {
    return request({
        url: 'order/index/conf',
        method: 'post',
        data
    })
}
export function findOrder(data) {
    return request({
        url: 'order/index/findOrder',
        method: 'post',
        data
    })
}

export function refundApply(data) {
    return request({
        url: 'order/index/refundApply',
        method: 'post',
        data
    })
}
export function createOrder(data) {
    return request({
        url: 'order/index/createOrder',
        method: 'post',
        data
    })
}

export function refundApplyList(data) {
    return request({
        url: 'order/index/refundApplyList',
        method: 'post',
        data
    })
}
export function agreeRefund(data) {
    return request({
        url: 'order/index/agreeRefund',
        method: 'post',
        data
    })
}
export function refundConf(data) {
    return request({
        url: 'order/index/refundConf',
        method: 'post',
        data
    })
}

