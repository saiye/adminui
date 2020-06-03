import Cookies from 'js-cookie'

const TokenKey = 'lrs_admin_token'

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  console.log('set token'+TokenKey+'---token:'+token)
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}
