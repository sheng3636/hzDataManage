import {
  constantRoutes
} from '@/router'
import Layout from '@/layout'
const asyncRoutes = [{
    path: '/accountMangement',
    component: 'Layout',
    children: [{
      path: 'accountMangement',
      component: '/accountMangement/accountMangement',
      name: 'AccountMangement',
      meta: {
        title: '账号管理',
        icon: 'accountMangement',
        affix: true
      }
    }]
  },
  {
    path: '/branchMangement',
    component: 'Layout',
    children: [{
      path: 'branchMangement',
      component: '/branchMangement/branchMangement',
      name: 'BranchMangement',
      meta: {
        title: '部门管理',
        icon: 'branchMangement',
        affix: true
      }
    }]
  },
  {
    path: '/feedback',
    component: 'Layout',
    children: [{
      path: 'feedback',
      component: '/feedback/feedback',
      name: 'Feedback',
      meta: {
        title: '反馈信息',
        icon: 'feedback',
        affix: true
      }
    }]
  },
  {
    path: '/loginsLog',
    component: 'Layout',
    children: [{
      path: 'loginsLog',
      component: '/loginsLog/loginsLog',
      name: 'LoginsLog',
      meta: {
        title: '系统日志',
        icon: 'loginsLog',
        affix: true
      }
    }]
  },
  // 404 page must be placed at the end !!!
  {
    path: '*',
    redirect: '/404',
    hidden: true
  }
]
export function filterAsyncRouter(asyncRouterMap) {
  const accessedRouters = asyncRouterMap.filter(route => {

    if (route.component1 === 'Layout') { //Layout组件特殊处理
      route.component = Layout
    } else {
      
      route.aaa = "@/views" + route.component + ".vue"
      route.component = (resolve) => require(["@/views" + route.component1  + ".vue"], resolve)
    }
    if (route.children && route.children.length > 0) {
      route.children = filterAsyncRouter(route.children)
    } else {
     delete route.children
    }
    return true

  })

  return accessedRouters
}

// let routerData = filterAsyncRouter(asyncRoutes)

const state = {
  routes: [],
  addRoutes: []
}

const mutations = {
  SET_ROUTES: (state, routes) => {
    state.addRoutes = routes
    state.routes = constantRoutes.concat(routes)
  }
}

const actions = {
  generateRoutes({
    commit
  }, menus) {
    return new Promise(resolve => {
      let routerData = filterAsyncRouter(menus)
      
      routerData.push({
        path: '*',
        redirect: '/404',
        hidden: true
      })
      commit('SET_ROUTES', routerData)
      resolve(routerData || [])
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
