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