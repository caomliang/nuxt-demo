const cookieparser = process.server ? require('cookieparser') : undefined
export const state = () => {
  return {
    userInfo: {}
  }
}
export const mutations = {
  setUser (state, data) {
    state.userInfo = data
  },
  removeUser (state, data) {
    state.userInfo = null
  }
}

export const actions = {
  // nuxtServerInit是特殊的nuxt方法，会在服务端渲染期间自动调用，初始化数据传递数据给 客户端使用
  nuxtServerInit ({ commit }, { req }) {
    let userInfo = null
    if (req.headers.cookie) {
      const parsed = cookieparser.parse(req.headers.cookie)
      try {
        userInfo = JSON.parse(parsed.userInfo)
      } catch (err) {
        // No valid cookie found
      }
    }
    commit('setUser', userInfo)
  }
}