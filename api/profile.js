import { request } from '@/plugins/request'
// 获取用户详情
export const getProfile = username => {
  return request({
    url: `/api/profiles/${username}`,
    method: 'get'
  })
}