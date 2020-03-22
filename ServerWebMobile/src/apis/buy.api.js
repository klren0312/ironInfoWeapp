import request from './request'

export function pay (data) {
  return request.post('/mobilePay', data)
}

export function getPayStatus (tradeNo) {
  return request.get('/pay/status/' + tradeNo)
}
