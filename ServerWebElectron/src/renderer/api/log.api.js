import request from './request'

export function getLog (queryString) {
  return request({
    url: `/log?${queryString}`,
    method: 'GET'
  })
}