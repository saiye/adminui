import request from 'utils/request'
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