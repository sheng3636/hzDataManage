import axios from 'axios'
import {
  MessageBox,
  Message
} from 'element-ui'
import store from '@/store'
import {
  getToken
} from '@/utils/auth'

// 创建一个axios实例
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  // withCredentials: true
  // 当跨域请求时发送cookie
  timeout: 10000 // 请求超时
})

// request interceptor
service.interceptors.request.use(
  config => {
    //在发送请求之前做些什么
    if (store.getters.token) {
      // 让每个请求携带token
      // ['accessToken'] 是自定义key
      // 请根据实际情况进行修改
      config.headers['accessToken'] = getToken()
    }
    return config
  },
  error => {
    // 对请求错误做些什么
    console.log(error)
    return Promise.reject(error)
  }
)

// 响应拦截器
service.interceptors.response.use(
  /**
   * 如果您想获得http信息， 如头或状态
   * 请返回response => response
   */

  /**
   * 通过自定义代码确定请求状态
   * 这里只是一个例子
   * 您还可以通过HTTP状态代码判断状态
   */
  response => {
    const res = response.data
    // 如果自定义代码不是0，则判断为错误。
    if (res.code !== 0) {
      Message({
        message: res.message || 'Error',
        type: 'error',
        duration: 5 * 1000
      })

      // 50008:非法token;50012:已登录的其他客户;50014:token过期;
      if (res.code === 401 || res.code === 403) {
        // 重新登陆
        MessageBox.confirm('您已经登出，您可以取消以继续停留在此页面，或重新登录', '确认注销', {
          confirmButtonText: '重新登陆',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          store.dispatch('user/resetToken').then(() => {
            location.reload()
          })
        })
      }
      return Promise.reject(new Error(res.message || 'Error'))
    } else {
      return res
    }
  },
  error => {
    console.log('err' + error)
    Message({
      message: error.message,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)
// 查询接口请求方法
export const apiGet = (url, params) => {
  return new Promise((resolve, reject) => {
    service.get(url, {
      params: params
    }).then(res => {
      resolve(res)
    }).catch(err => {
      reject(err)
    })
  })
}

// 通用提示内容post提交接口请求方法
export const apiPost = (that, url, data) => {
  return new Promise((resolve, reject) => {
    that.$confirm('确认提交吗？', '提示', {}).then(() => {
      service.post(url, data).then(res => {
        let type = res.code === 0 ? 'success' : 'warning'
        that.$message({
          type: type,
          message: res.message
        })
        resolve(res)
      }).catch(err => {
        reject(err)
      })
    })
  })
}

// 自定义提示内容post提交接口请求方法
export const apiPostCustom = (url, data, content) => {
  return new Promise((resolve, reject) => {
    Message.$confirm(content, '提示', {
      type: 'warning'
    }).then(() => {
      service.post(url, data).then(res => {
        let type = res.code === 0 ? 'success' : 'warning'
        Message.$message({
          type: type,
          message: res.message
        })
        resolve(res)
      }).catch(err => {
        reject(err)
      })
    })
  })
}

// 无提示内容post接口请求方法
export const apiDefaultPost = (url, data) => {
  return new Promise((resolve, reject) => {
    service.post(url, data).then(res => {
      resolve(res)
    }).catch(err => {
      reject(err)
    })
  })
}

// 通用提示内容delete删除接口请求方法
export const apiDelete = (that, url, data) => {
  return new Promise((resolve, reject) => {
    that.$confirm('确认删除所选的数据吗？该数据删除后不可恢复，请谨慎操作！', '提示', {
      type: 'warning'
    }).then(() => {
      service.delete(url, {
        data: data
      }).then(res => {
        const code = res.code
        if (code == 0) {
          that.$message({
            type: 'success',
            message: res.message
          })
        }
        resolve(res)
      }).catch(err => {
        that.listLoading = false
        reject(err)
      })
    })
  })
}

// 自定义提示内容delete删除接口请求方法
export const apiDeleteCustom = (that, url, data, content) => {
  return new Promise((resolve, reject) => {
    that.$confirm(content, '提示', {
      type: 'warning'
    }).then(() => {
      service.delete(url, {
        data: data
      }).then(res => {
        const code = res.code
        const type = code == 0 ? 'success' : 'warning'
        that.$message({
          type: type,
          message: res.message
        })
        resolve(res)
      }).catch(err => {
        reject(err)
      })
    })
  })
}

// // 通用提示内容put修改接口请求方法
// export const apiPut = (url, params) => {
//   return new Promise((resolve, reject) => {
//     that.$confirm('确认提交吗？', '提示', {}).then(() => {
//       service.put(url, params).then(res => {
//         const code = res.code
//         const msg = code === 0 ? 'success' : 'warning'
//         that.$message({
//           type: msg,
//           message: res.message
//         })
//         resolve(res.data)
//       }).catch(err => {
//         reject(err)
//       })
//     })
//   })
// }

// // 无提示内容put提交接口请求方法
// export const apiDefaultPut = (url, params) => {
//   return new Promise((resolve, reject) => {
//     service.put(url, params).then(res => {
//       const code = res.code
//       if (code == 0) {
//         that.$message({
//           type: 'success',
//           message: res.message
//         })
//       }
//       resolve(res.data)
//     }).catch(err => {
//       reject(err)
//     })
//   })
// }

// // 自定义提示内容put提交接口请求方法
// export const apiPutCustom = (url, params, content) => {
//   return new Promise((resolve, reject) => {
//     that.$confirm(content, '提示', {
//       type: 'warning'
//     }).then(() => {
//       service.put(url, params).then(res => {
//         const code = res.code
//         if (code == 0) {
//           that.$message({
//             type: 'success',
//             message: res.message
//           })
//         }
//         resolve(res.data)
//       }).catch(err => {
//         reject(err)
//       })
//     })
//   })
// }

export default service
