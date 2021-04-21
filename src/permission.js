import router from './router'
import store from './store'
import { Message } from 'element-ui'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import { getToken } from '@/utils/auth'
import getPageTitle from '@/utils/get-page-title'

NProgress.configure({
  showSpinner: false
}) // NProgress配置

const whiteList = ['/login'] // 没有重定向白名单

router.beforeEach(async(to, from, next) => {
  if (to.path.slice(0, 14) !== '/dataMangement' && to.path) {
    store.state.user.sunNavVisi = false
  }
  // 开始进度条
  NProgress.start()

  // 设置页面标题
  document.title = getPageTitle(to.meta.title)

  // 确定用户是否已经登录
  const hasToken = getToken()
  if (hasToken) {    
    if (to.path === '/login') {
      // 如果已登录，则重定向到主页
      next({ path: '/' })
      NProgress.done()
    } else {
      // 确定用户是否通过getInfo获得了他的权限角色
      const hasRoles = store.getters.roles && store.getters.roles.length > 0
      if (hasRoles) {
        next()
      } else {
        try {
          // 获取用户信息
          // 注意:角色必须是一个对象数组!例如:['admin']或['developer'，'editor']
          const { menus } = await store.dispatch('user/getInfo')
          // 根据角色生成可访问的路线图
          const accessRoutes = await store.dispatch('permission/generateRoutes', menus)
          // 动态添加可访问路由
          router.addRoutes(accessRoutes)
          // hack方法以确保addRoutes是完整的
          // 设置replace: true，这样导航就不会留下历史记录
          next({ ...to, replace: true })
        } catch (error) {
          // 删除token，进入登录页面重新登录
          await store.dispatch('user/resetToken')
          Message.error(error)
          console.log(error);
          // next(`/login?redirect=${to.path}`)
          next(`/login?redirect=home`)
          NProgress.done()
        }
      }
    }
  } else {
    /* 是否存在token */
    if (whiteList.indexOf(to.path) !== -1) {
      // 在自由登录白名单中，直接登录
      next()
    } else {
      // 没有访问权限的其他页面被重定向到登录页面。
      // next(`/login?redirect=${to.path}`)
      next(`/login?redirect=home`)
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  // 完成进度条
  NProgress.done()
})
