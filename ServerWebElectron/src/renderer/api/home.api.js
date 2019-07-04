import request from './request'

export function getHomeSum() {
  return request.get('/homeSum')
}

export function getWxSum() {
  return request.get('/wechatUser')
}