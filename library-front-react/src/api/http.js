import axios from 'axios'
import { message } from 'antd';

// 创建 Axios 实例
const instance = axios.create({
  baseURL: '/api',
  timeout: 5000,
});

// 添加请求拦截器
instance.interceptors.request.use(
  config => {
    // 在发送请求之前做些什么
    // console.log('Request Interceptor:', config);
    return config;
  },
  error => {
    // 对请求错误做些什么
    console.error('Request Interceptor Error:', error);
    return Promise.reject(error);
  }
);


// 添加响应拦截器
instance.interceptors.response.use(
  response => {
    // 对响应数据做些什么
    const data = response.data

    if (data.code === '00') {
      return data
    }

    if (data.code === '01') {
      message.info(JSON.stringify(data.msg))

    }

    if (response.config.responseType === 'blob') {
      return data
    }
    
    throw response;
  },
  error => {
    // 对响应错误做些什么
    console.log('捕获')
    if (error.response.data.errors === "未登录") {
      window.location.replace("/login")
    }
    return Promise.reject(error);
  }
);

export default instance