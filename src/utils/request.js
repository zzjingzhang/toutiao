// 请求模块
import axios from 'axios'
import store from '@/store'
import JSONBig from 'json-bigint'
const request = axios.create({
  baseURL: 'http://ttapi.research.itcast.cn/', // 基础路径
  // 自定义后端返回的原始数据
  // data 后端返回的原始数据
  transformResponse: [function (data) {
    try {
      return JSONBig.parse(data)
    } catch (err) {
      return data
    }
  }]
})


// 请求拦截器
// 添加请求拦截器
request.interceptors.request.use(function (config) {
  // 在发送请求之前做些什么
  // config 请求配置对象
  const {
    user
  } = store.state
  if (user && user.token) {
    config.headers.Authorization = `Bearer ${store.state.user.token}`
    // console.log(config)
  }
  return config
}, function (error) {
  // 对请求错误做些什么
  return Promise.reject(error)
})

export default request
