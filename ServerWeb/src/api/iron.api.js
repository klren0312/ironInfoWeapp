import request from './request'

export function getIron (queryString) {
  return request({
    url:`/iron?${queryString}`,
    method: 'GET'
  })
}

export function getPriceById (id) {
  return request({
    url: '/iron/price/' + id,
    method: 'GET'
  })
}

export function getAllIron () {
  return request.get('/iron/all')
}

export function updateIron (iron) {
  return request({
    method:'PATCH',
    url: '/iron',
    data: iron
  })
}

export function createIron(ironForm) {
  return request({
    url: '/iron',
     method: 'post',
     data: ironForm
   })
}

export function addNewPrice (id, value) {
  return request({
    url: `/iron/price`,
    method: 'POST',
    data: {
      id: id,
      price: parseFloat(value)
    }
  })
}

export function deleteIron (id) {
  return request({
    url: '/iron',
    method: 'DELETE',
    data: {
      id: id
    }
  })
}