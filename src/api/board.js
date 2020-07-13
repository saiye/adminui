import request from '@/tools/request'

export function boardList(data) {
    return request({
        url: 'game/board/boardList',
        method: 'post',
        data
    })
}

export function editBoard(data) {
    return request({
        url: 'game/board/editBoard',
        method: 'post',
        data
    })
}

export function addBoard(data) {
    return request({
        url: 'game/board/addBoard',
        method: 'post',
        data
    })
}
export function importExcel(data) {
    return request({
        url: 'game/board/excel',
        method: 'post',
        data
    })
}