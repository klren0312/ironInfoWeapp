import request from './request'

/**
 * 微信登录
 */
export function weLogin () {
  return request({
    url: `/wechat/login`,
    method: 'GET'
  })
}

/**
 * 获取微信好友
 */
export function weFriends () {
  return request({
    url: `/wechat/friends`,
    method: 'GET'
  })
}
