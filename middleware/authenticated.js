/**
 * 验证是否登录
 */
export default function ({ store, redirect }) {
  if (!store.state.userInfo) {
    return redirect('/login')
  }
}