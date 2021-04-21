import request from '@/utils/request'
const Qs = require('qs');
// 获取登录验证码
export function getVerifyCode() {
  return request({
    url: 'common/captcha/init',
    method: 'get'
  })
}
// 登录
export function login(data) {
  return request({
    url: 'common/login',
    method: 'post',
    data: Qs.stringify(data)
  })
}
// 获取用户信息
export function getInfo() {
  return request({
    url: 'system/user/info',
    method: 'get',
    params: {
      loginType:"1"
    }
  })
}
