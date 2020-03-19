import axios from 'axios'
import router from '../router'
import Storage from 'zstorage'
import store from '../store'
import { Message } from 'element-ui'
// create an axios instance
const service = axios.create({
  baseURL: store.state.baseUrl,
  timeout: 5000
})

service.interceptors.request.use(
  config => {
    config.url = store.state.baseUrl  + config.url
    let token = Storage.get('admin_user') ? Storage.get('admin_user').token : ''
    if (token) {
      config.headers['Authorization'] = token
      config.headers['Content-Type'] = 'application/json'
    }
    return config
  },
  error => {
    Promise.reject(error)
  }
)

service.interceptors.response.use(
  response => {
    try {
      let req = JSON.parse(response.request.response)
      if (req.err_code === 401) {
        store.commit('LOG_OUT')
        router.replace({
          path: '/login',
        })
        return true
      }
      if (response.data.code === 200) {
        return response.data.data
      } else {
        Message({
          message: response.data.data,
          type: 'error',
          duration: 5 * 1000
        })
        return false
      }
    } catch (e) { // 用于文件下载
      return response.data
    }
  },
  error => {
    if (error.response) {
 
      switch (error.response.status) {
        case 401:
          // 返回 401 清除token信息并跳转到登录页面
          store.dispatch('SET_USER', null)
          router.replace({
            path: '/login',
          })
          break;
        default: 
          Message({
            message: error.response.data.message,
            type: 'error'
          })
      }
    }
    return Promise.reject(error.response.data)   // 返回接口返回的错误信息
  })

export default service
