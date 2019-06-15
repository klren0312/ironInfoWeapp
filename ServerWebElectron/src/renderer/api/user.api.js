import request from './request'

export function getUser (queryString) {
  return request({
    url:`/user?${queryString}`,
    method: 'GET'
  })
}

export function updateIron (edit) {
  return request({
    url: `/user`,
    method: 'PUT',
    data: {
      id: edit.id,
      password: edit.password,
      email: edit.email
    }
  })
}

export function addUser (user) {
  return request({
    url: '/user/register',
    method: 'post',
    data: user
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