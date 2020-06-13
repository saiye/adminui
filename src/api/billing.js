import request from '@/tools/request'
export function billingConfig() {
    return request({
        url: '/room/billing/billingConfig',
        method: 'post',
    })
}

export function addBilling(data) {
    return request({
        url: '/room/billing/addBilling',
        method: 'post',
        data
    })
}

export function billingList(data) {
    return request({
        url: '/room/billing/billingList',
        method: 'post',
        data
    })
}