import Cookies from 'js-cookie'

export function getToken() {
  return Cookies.get('dataToken')
}

export function setToken(token) {
  return Cookies.set('dataToken', token)
}

export function removeToken() {
  return Cookies.remove('dataToken')
}
