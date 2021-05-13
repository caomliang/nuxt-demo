export default function ({ store, redirect }) {
  if (store.state.userInfo) {
    return redirect('/')
  }
}