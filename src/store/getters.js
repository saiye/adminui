const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  token: state => state.cpuser.token,
  avatar: state => state.cpuser.avatar,
  user_name: state => state.cpuser.user_name,
  user_id: state => state.cpuser.user_id,
  role_id: state => state.cpuser.role_id,
  email: state => state.cpuser.email,
}
export default getters
