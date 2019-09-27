import request from './request'

export function getLog (queryString) {
  return request({
    url: `/log?${queryString}`,
    method: 'GET'
  })
}

export function saveEvent (events) {
  return request({
    url: `/log/record`,
    method: 'put',
    data: {
      ctrlData: events
    }
  })
}
