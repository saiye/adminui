import request from '@/tools/request'
export function companyList(data) {
    return request({
        url: '/company/index/companyList',
        method: 'post',
        data
    })
}
export function addCompany(data) {
    return request({
        url: '/company/index/addCompany',
        method: 'post',
        data
    })
}
export function editCompany(data) {
    return request({
        url: '/company/index/editCompany',
        method: 'post',
        data
    })
}
export function checkCompany(data) {
    return request({
        url: '/company/index/checkCompany',
        method: 'post',
        data
    })
}

export function lockCompany(data) {
    return request({
        url: '/company/index/lockCompany',
        method: 'post',
        data
    })
}

export function getStateData() {
    return request({
        url: '/company/index/getState',
        method: 'post',
    })
}
export function areaList(data) {
    return request({
        url: '/company/index/areaList',
        method: 'post',
        data
    })
}
