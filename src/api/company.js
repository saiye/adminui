import request from '../tools/request'
export function companyList(data) {
    return request({
        url: '/company/Index/companyList',
        method: 'post',
        data
    })
}
export function addCompany(data) {
    return request({
        url: '/company/Index/addCompany',
        method: 'post',
        data
    })
}
export function checkCompany(data) {
    return request({
        url: '/company/Index/checkCompany',
        method: 'post',
        data
    })
}

export function getStateData() {
    return request({
        url: '/company/Index/getState',
        method: 'post',
    })
}