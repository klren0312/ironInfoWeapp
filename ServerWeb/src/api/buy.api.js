import request from './request'

export function pay (data) {
  return request.post('/pay', data)
}

export function getPayStatus (tradeNo) {
  return request.get('/pay/status/' + tradeNo)
}

export function getOrderList (queryString) {
  return request.get(`/pay/order?${queryString}`)
}
