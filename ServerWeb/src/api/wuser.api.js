import request from './request'

export function getWuser (queryString) {
  return request({
    url:`/wuser?${queryString}`,
    method: 'GET'
  })
}

export function getReqPath () {
  return request({
    url: '/wpath',
    method: 'GET'
  })
}
