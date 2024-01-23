import request from './http'

// 获取书籍列表
export const getBookList = (data = {}) => request.get('/verify/book/allBook', {
    params: data
})
