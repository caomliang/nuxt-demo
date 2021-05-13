import { request } from '@/plugins/request'
// 登录
export const login = data => {
  return request({
    url: '/api/users/login',
    method: 'post',
    data
  })
}

// 注册
export const register = data => {
  return request({
    url: '/api/users',
    method: 'post',
    data
  })
}