import store from '@/store'

function checkPermission(el, binding) {
  const { value } = binding
  const auths = store.getters && store.getters.auth
  if (value && value instanceof Array) {
    if (value.length > 0) {
      const hasPermission = auths.some(role => {
        return value.includes(role)
      })
      if (!hasPermission) {
        el.parentNode && el.parentNode.removeChild(el)
      }
    }
  } else {
    throw new Error(`需要权限值! 比如 v-permission="['admin','editor']"`)
  }
}

export default {
  inserted(el, binding) {
    checkPermission(el, binding)
  },
  update(el, binding) {
    checkPermission(el, binding)
  }
}
