import { request } from '@/plugins/request'
// 获取公共文章列表
export const getArticle = params => {
  return request({
    url: '/api/articles',
    method: 'get',
    params
  })
}

export const getFeedArticle = params => {
  return request({
    url: '/api/articles/feed',
    method: 'get',
    params
  })
}

// 添加点赞
export const addFavorite = slug => {
  return request({
    url: `/api/articles/${slug}/favorite`,
    method: 'post'
  })
}

// 取消点赞
export const cancelFavorite = slug => {
  return request({
    url: `/api/articles/${slug}/favorite`,
    method: 'DELETE'
  })
}

// 获取文章详情
export const getArticleById = slug => {
  return request({
    url: `/api/articles/${slug}`,
    method: 'get'
  })
}

// 获取文章评论
export const getComments = slug => {
  return request({
    method: 'GET',
    url: `/api/articles/${slug}/comments`
  })
}