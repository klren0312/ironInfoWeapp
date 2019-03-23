import request from './request'

export function getHot () {
  return request({
    url:`/hot`,
    method: 'GET'
  })
}

export function updateSort (hot) {
  return request.put('/hot', {
    list: hot
  })
}

export function deleteHot (id) {
  return request({
    url: '/hot',
    method: 'DELETE',
    data: {
      id: id
    }
  })
}

export function createHot (hotForm) {
  return request({
    url: '/hot',
     method: 'post',
     data: hotForm
   })
}