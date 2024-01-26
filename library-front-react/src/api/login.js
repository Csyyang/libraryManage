import request from './http'

export const login = (data = {}) => request.post('/ordinary/login', {
    password: data.password,
    id_card_number: data.username
})

export const admLogin = (data = {}) => request.post('/ordinary/AdmLogin', data)

export const loginOut = () => request.get('/verify/logout')