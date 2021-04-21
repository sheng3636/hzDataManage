<template>
  <div style="width:260px;height:100%;margin-left:20px;background:#f2f2f2;"
    :style="{width:$store.state.user.sunNavVisi ? '260px' : '100px'}">
    <div style="width:100px;height:100%;background:#fff;">
      <sidebar-item v-for="(route) in permission_routes" :key="route.path" :item="route" :base-path="route.path">
      </sidebar-item>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import SidebarItem from './SidebarItem'
import variables from '@/styles/variables.scss'

export default {
  components: { SidebarItem },
  computed: {
    ...mapGetters(['permission_routes', 'sidebar']),
    activeMenu() {
      const route = this.$route
      const { meta, path } = route
      // 如果设置路径，sidebar将突出显示您设置的路径
      if (meta.activeMenu) {
        return meta.activeMenu
      }
      return path
    },
    variables() {
      return variables
    },
  },
  data() {
    return {
    }
  },
  methods: {
  },
}
</script>
