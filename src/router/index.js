import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * 注意: 子菜单只在路由子菜单时出现。 children.length > = 1
 *
 * hidden: true                   如果设置为true，项目将不会显示在侧边栏中(默认为false)
 * alwaysShow: true               如果设置为true，将始终显示根菜单
 *                                如果没有设置alwaysShow，当项目有多个子路由时，
 *                                它将变成嵌套模式，否则不显示根菜单
 * redirect: noRedirect           如果设置了noRedirect，则在面包屑中没有重定向
 * name:'router-name'             
 * meta : {
    roles: ['admin','editor']    控制页面角色(可以设置多个角色)
    title: 'title'               名称显示在侧边栏和breadcrumb(推荐设置)
    icon: 'svg-name'/'el-icon-x' 图标显示在侧边栏中
    noCache: true                如果设置为true，页面将不会被缓存(默认为false)
    affix: true                  如果设置为true，标签将附加到标签视图中
    breadcrumb: false            如果设置为false，项目将隐藏在breadcrumb中(默认为true)
    activeMenu: '/example/list'  如果设置了path，侧边栏将突出显示设置的路径
  }
 */

/**
 * 基本路由
 * 没有权限要求的基本页面
 * 所有角色都可以访问
 */
export const constantRoutes = [{
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [{
      path: '/redirect/:path(.*)',
      component: () => import('@/views/redirect/index')
    }]
  },
  {
    path: '/login',
    component: () => import('@/views/login/login'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/error-page/404'),
    hidden: true
  },
  {
    path: '/401',
    component: () => import('@/views/error-page/401'),
    hidden: true
  },
  {
    path: '/',
    component: Layout,
    redirect: '/home',
    children: [{
      path: 'home',
      component: () => import('@/views/home/home'),
      name: 'Home',
      meta: {
        title: '首页',
        icon: 'home',
        affix: true
      }
    }]
  },
  // {
  //   path: '/dataOverview',
  //   component: Layout,
  //   children: [{
  //     path: 'dataOverview',
  //     component: () => import('@/views/dataOverview/dataOverview'),
  //     name: 'DataOverview',
  //     meta: {
  //       title: '数据总览',
  //       icon: 'dataOverview',
  //       affix: true
  //     }
  //   }]
  // },
  // {
  //   path: '/dataMangement',
  //   component: Layout,
  //   redirect: '/dataMangement/synthesisAnalysisList',
  //   name: 'DataMangement',
  //   meta: {
  //     title: '数据分析',
  //     icon: 'dataMangement'
  //   },
  //   children: [{
  //       path: 'synthesisAnalysisList',
  //       component: () => import('@/views/dataMangement/synthesisAnalysis/synthesisAnalysis'),
  //       name: 'SynthesisAnalysis',
  //       meta: {
  //         title: '综合分析'
  //       }
  //     },
  //     {
  //       path: 'synthesisAnalysisDetail',
  //       component: () => import('@/views/dataMangement/synthesisAnalysis/synthesisAnalysisDetail/synthesisAnalysisDetail'),
  //       name: 'SynthesisAnalysisDetail',
  //       hidden: true,
  //       meta: {
  //         title: '综合分析指标详情',
  //         activeMenu: '/dataMangement/synthesisAnalysisList',
  //       }
  //     },
  //     {
  //       path: 'industrialDevList',
  //       component: () => import('@/views/dataMangement/industrialDev/industrialDev'),
  //       name: 'IndustrialDev',
  //       meta: {
  //         title: '产业发展'
  //       }
  //     },
  //     {
  //       path: 'industrialDevDetail',
  //       component: () => import('@/views/dataMangement/industrialDev/industrialDevDetail/industrialDevDetail'),
  //       name: 'IndustrialDevDetail',
  //       hidden: true,
  //       meta: {
  //         title: '产业发展指标详情',
  //         activeMenu: '/dataMangement/industrialDevList',
  //       }
  //     },
  //     {
  //       path: 'industrialDevDetail1',
  //       component: () => import('@/views/dataMangement/industrialDev/industrialDevDetail/industrialDevDetail1'),
  //       name: 'IndustrialDevDetail1',
  //       hidden: true,
  //       meta: {
  //         title: '产业发展指标详情',
  //         activeMenu: '/dataMangement/industrialDevList',
  //       }
  //     },
  //     {
  //       path: 'trafficList',
  //       component: () => import('@/views/dataMangement/traffic/traffic'),
  //       name: 'Traffic',
  //       meta: {
  //         title: '综合交通'
  //       }
  //     },
  //     {
  //       path: 'trafficDetail',
  //       component: () => import('@/views/dataMangement/traffic/trafficDetail/trafficDetail'),
  //       name: 'TrafficDetail',
  //       hidden: true,
  //       meta: {
  //         title: '综合交通指标详情',
  //         activeMenu: '/dataMangement/trafficList',
  //       }
  //     },
  //     {
  //       path: 'energyList',
  //       component: () => import('@/views/dataMangement/energy/energy'),
  //       name: 'Energy',
  //       meta: {
  //         title: '能源发展'
  //       }
  //     },
  //     {
  //       path: 'energyDetail',
  //       component: () => import('@/views/dataMangement/energy/energyDetail/energyDetail'),
  //       name: 'EnergyDetail',
  //       hidden: true,
  //       meta: {
  //         title: '能源发展指标详情',
  //         activeMenu: '/dataMangement/energyList',
  //       }
  //     },
  //     {
  //       path: 'peopleAnalyzeList', 
  //       component: () => import('@/views/dataMangement/peopleAnalyze/peopleAnalyze'),
  //       name: 'PeopleAnalyze',
  //       meta: {
  //         title: '人口社会'
  //       }
  //     },
  //     {
  //       path: 'peopleAnalyzeDetail',
  //       component: () => import('@/views/dataMangement/peopleAnalyze/peopleAnalyzeDetail/peopleAnalyzeDetail'),
  //       name: 'PeopleAnalyzeDetail',
  //       hidden: true,
  //       meta: {
  //         title: '人口社会指标详情',
  //         activeMenu: '/dataMangement/peopleAnalyzeList',
  //       }
  //     },
  //     {
  //       path: 'peopleAnalyzeDetail1',
  //       component: () => import('@/views/dataMangement/peopleAnalyze/peopleAnalyzeDetail/peopleAnalyzeDetail1'),
  //       name: 'PeopleAnalyzeDetail1',
  //       hidden: true,
  //       meta: {
  //         title: '人口社会指标详情',
  //         activeMenu: '/dataMangement/peopleAnalyzeList',
  //       }
  //     },
  //     {
  //       path: 'environmentalList', 
  //       component: () => import('@/views/dataMangement/environmental/environmental'),
  //       name: 'Environmental',
  //       meta: {
  //         title: '生态环境'
  //       }
  //     },
  //     {
  //       path: 'environmentalDetail',
  //       component: () => import('@/views/dataMangement/environmental/environmentalDetail/environmentalDetail'),
  //       name: 'EnvironmentalDetail',
  //       hidden: true,
  //       meta: {
  //         title: '生态环境指标详情',
  //         activeMenu: '/dataMangement/environmentalList',
  //       }
  //     },
  //     {
  //       path: 'environmentalDetail1',
  //       component: () => import('@/views/dataMangement/environmental/environmentalDetail/environmentalDetail1'),
  //       name: 'EnvironmentalDetail1',
  //       hidden: true,
  //       meta: {
  //         title: '生态环境指标详情',
  //         activeMenu: '/dataMangement/environmentalList',
  //       }
  //     },
  //   ]
  // }
]

/**
 * 动态路由
 * 需要根据用户角色动态加载的路由
 */
// export const asyncRoutes = [
// {
//     path: '/accountMangement',
//     component: Layout,
//     children: [{
//       path: 'accountMangement',
//       component: () => import('@/views/accountMangement/accountMangement'),
//       name: 'AccountMangement',
//       meta: {
//         title: '账号管理',
//         icon: 'accountMangement',
//         affix: true
//       }
//     }]
//   },
//   {
//     path: '/branchMangement',
//     component: Layout,
//     children: [{
//       path: 'branchMangement',
//       component: () => import('@/views/branchMangement/branchMangement'),
//       name: 'BranchMangement',
//       meta: {
//         title: '部门管理',
//         icon: 'branchMangement',
//         affix: true
//       }
//     }]
//   },
//   {
//     path: '/feedback',
//     component: Layout,
//     children: [{
//       path: 'feedback',
//       component: () => import('@/views/feedback/feedback'),
//       name: 'Feedback',
//       meta: {
//         title: '反馈信息',
//         icon: 'feedback',
//         affix: true
//       }
//     }]
//   },
//   {
//     path: '/loginsLog',
//     component: Layout,
//     children: [{
//       path: 'loginsLog',
//       component: () => import('@/views/loginsLog/loginsLog'),
//       name: 'LoginsLog',
//       meta: {
//         title: '系统日志',
//         icon: 'loginsLog',
//         affix: true
//       }
//     }]
//   },
// {
//   path: '/roleMangement',
//   component: Layout,
//   children: [{
//     path: 'roleMangement',
//     component: () => import('@/views/roleMangement/roleMangement'),
//     name: 'RoleMangement',
//     meta: {
//       title: '角色管理',
//       icon: 'roleMangement',
//       affix: true
//     }
//   }]
// },

//   // 404 page must be placed at the end !!!
//   {
//     path: '*',
//     redirect: '/404',
//     hidden: true
//   }
// ]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({
    y: 0
  }),
  routes: constantRoutes
})

const router = createRouter()

export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
