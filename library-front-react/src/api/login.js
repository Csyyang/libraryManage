import request from './http'

export const login = (data = {}) => request.post('/ordinary/login', data)
export const admLogin = (data = {}) => request.post('/ordinary/AdmLogin', data)