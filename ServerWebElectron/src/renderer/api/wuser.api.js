import request from './request'

export function getWuser (queryString) {
  return request({
    url:`/wuser?${queryString}`,
    method: 'GET'
  })
}