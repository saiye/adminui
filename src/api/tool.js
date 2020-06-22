import request from '@/tools/request'


export function uploadImage(data) {
    return request({
        url: 'tool/image/upload',
        method: 'post',
        data
    })
}

export function deleteImage(data) {
    return request({
        url: 'tool/image/delete',
        method: 'post',
        data
    })
}