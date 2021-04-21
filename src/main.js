import Vue from 'vue'

import Cookies from 'js-cookie'

import 'normalize.css/normalize.css'

import Element from 'element-ui'
import './styles/element-variables.scss'

import '@/styles/index.scss'

import App from './App'
import store from './store'
import router from './router'

import './icons'
import './permission'
import './utils/error-log'

import permission from '@/directive/permission/index.js' // 权限判断指

Vue.use(Element, {
  size: Cookies.get('size') || 'medium', // 设置元素-ui默认大小
})
// 注册全局按钮权限指令
Vue.use(permission)

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
