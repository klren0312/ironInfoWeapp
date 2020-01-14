import request from './request'

export function getArticle (queryString) {
  return request.get(`/article?${queryString}`)
}

export function getArticleById (id) {
  return request.get(`/article?id=${id}`)
}

export function updateArticleStatus (id, status) {
  return request.patch('/article', {
    id: id,
    status: status
  })
}

export function updateArticle (id, title, content) {
  return request.put('/article', {
    id: id,
    title: title,
    content: content
  })
}

export function publishArticle (title, content) {
  return request.post('/article', {
    title: title,
    content: content
  })
}

export function deleteArticle (id) {
  return request({
    method: 'DELETE',
    url: '/article',
    data: {
      id: id
    }
  })
}