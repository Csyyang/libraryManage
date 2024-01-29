import request from './http'

// 获取书籍列表
export const getBookList = (data = {}) => request.get('/verify/book/allBook', {
    params: data
})

// 预约借书
export const borrowing = (data = {}) => request.post('/verify/book/borrowing', data)

// 借阅记录
export const borrowRecord = (data = {}) => request.get('/verify/book/personBorrowed', {
    params: data
})

// 借阅审核列表
export const borrowRecordQ = (data = {}) => request.get('verify/admin/book/borrowConfirmList', {
    params: data
})

// 同意借阅
export const borrowConfirm = (data = {}) => request.post('/verify/admin/book/borrowConfirm', data)

// 预约还书
export const returnedQ = (data = {}) => request.post('/verify/book/returnedQ', data)

// 归还审核列表
export const returnConfirmList = (data = {}) => request.get('/verify/admin/book/returnConfirmList', {
    params: data
})

// 归还通过
export const returnConfirm = (data = {}) => request.post('/verify/admin/book/returnConfirm', data)


// 预约拒绝
export const borrowRefuse = (data = {}) => request.post('/verify/admin/book/borrowRefuse', data)

// 归还拒绝
export const returnRefuse = (data = {}) => request.post('/verify/admin/book/returnRefuse', data)

// 下载模板
export const downLoadExcl = () => request.get('/verify/admin/downLoadExcl?type=book', {
    responseType: 'blob'
})

// 上传模板
export const uploadExcl = (formData) => request.post('/verify/admin/book/warehousing', formData, {
    headers: {
        'Content-Type': 'multipart/form-data'
    }
})

// 

export const editItem = (data) => request.post('/verify/admin/book/editItem', data)