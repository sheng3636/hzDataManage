<template>
  <div v-if="!item.hidden">
    <div
      v-if="hasOneShowingChild(item.children,item) && (!onlyOneChild.children||onlyOneChild.noShowingChildren)&&!item.alwaysShow">
      <app-link v-if="onlyOneChild.meta" :to="resolvePath(onlyOneChild.path)">
        <div class="navRow" @click="singleClick(onlyOneChild.path)">
          <svg-icon :icon-class="onlyOneChild.meta.icon||(item.meta&&item.meta.icon)" />
          <span>{{onlyOneChild.meta.title}}</span>
          
        </div>
      </app-link>
    </div>
    <div v-else>
      <app-link :to="resolvePath(item.children[0].path)">
        <div class="navRow" :class="{aaa:$store.state.user.sunNavVisi}" @click="multipleClick">
          <svg-icon v-if="item.meta" :icon-class="item.meta && item.meta.icon" />
          <span v-if="item.meta">{{item.meta.title}}</span>
        </div>
      </app-link>
      <div class="bbb" v-if="$store.state.user.sunNavVisi">
        <sidebar-item v-for="child in item.children" :key="child.path" :item="child"
          :base-path="resolvePath(child.path)" />
      </div>
    </div>
  </div>
</template>

<script>
import path from 'path'
import { isExternal } from '@/utils/validate'
import AppLink from './Link'
export default {
  name: 'SidebarItem',
  components: { AppLink },
  props: {
    item: {
      type: Object,
      required: true,
    },
    basePath: {
      type: String,
      default: '',
    },
  },
  computed: {
    activeMenu() {
      const route = this.$route
      const { meta, path } = route
      // if set path, the sidebar will highlight the path you set
      if (meta.activeMenu) {
        return meta.activeMenu
      }
      return path
    },
  },
  data() {
    this.onlyOneChild = null
    return {
      sunNavVisi: false,
    }
  },
  methods: {
    singleClick(val) {
      if (val) {
        this.$store.state.user.sunNavVisi = false
      }
    },
    multipleClick() {
      this.$store.state.user.sunNavVisi = true
    },
    hasOneShowingChild(children = [], parent) {
      const showingChildren = children.filter((item) => {
        if (item.hidden) {
          return false
        } else {
          // 临时设置(将在只有一个显示子元素时使用)
          this.onlyOneChild = item
          return true
        }
      })
      // 当只有一个子路由器时，默认显示该子路由器
      if (showingChildren.length === 1) {
        return true
      }
      // 如果没有子路由器显示，则显示parent
      if (showingChildren.length === 0) {
        this.onlyOneChild = { ...parent, path: '', noShowingChildren: true }
        return true
      }
      return false
    },
    resolvePath(routePath) {
      if (isExternal(routePath)) {
        return routePath
      }
      if (isExternal(this.basePath)) {
        return this.basePath
      }
      return path.resolve(this.basePath, routePath)
    },
  },
}
</script>
<style lang="scss">
.navRow {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  flex-direction: column;
  height: 80px;
  line-height: 80px;
  font-size: 16px;
  color: #2562dc;
  span {
    width: 100%;
    display: block;
    line-height: 30px;
    text-align: center;
  }
}
.router-link-active {
  .navRow {
    background-color: #f2f2f2 !important;
    &::before {
      content: '';
      position: absolute;
      left: 0;
      display: block;
      width: 6px;
      height: 100%;
      border-top-right-radius: 4px;
      border-bottom-right-radius: 4px;
      background: #2562dc;
    }
  }
}
.aaa {
  .navRow {
    background-color: #fff;
  }
  &::before {
    content: '';
    position: absolute;
    left: 0;
    display: block;
    width: 6px;
    height: 100%;
    border-top-right-radius: 4px;
    border-bottom-right-radius: 4px;
    background: #2562dc;
  }
}
.bbb {
  position: absolute;
  z-index: 999;
  top: 20px;
  left: 130px;
  width: 150px;
  height: calc(100% - 20px);
  background-color: #fff;
  .navRow {
    height: 60px;
    line-height: 60px;
    font-size: 16px;
    color: #2562dc;
    svg {
      display: none;
    }
    span {
      width: 100%;
      display: block;
      line-height: 30px;
      text-align: center;
    }
  }
}
</style>
