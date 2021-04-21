<template>
  <div class="bodyWrap">
    <navbar />
    <div :class="classObj" class="app-wrapper">
      <sidebar class="sidebar-container" />
      <div :class="{hasTagsView:needTagsView}" class="main-container" :style="{width:$store.state.user.sunNavVisi ? 'calc(100% - 240px)' : 'calc(100% - 100px)'}">
        <div :class="{'fixed-header':fixedHeader}">
        </div>
        <app-main />
      </div>
    </div>
  </div>
</template>

<script>
import { AppMain, Navbar, Settings, Sidebar } from './components'
import ResizeMixin from './mixin/ResizeHandler'
import { mapState } from 'vuex'

export default {
  name: 'Layout',
  components: {
    AppMain,
    Navbar,
    Settings,
    Sidebar,
  },
  mixins: [ResizeMixin],
  computed: {
    ...mapState({
      sidebar: (state) => state.app.sidebar,
      device: (state) => state.app.device,
      showSettings: (state) => state.settings.showSettings,
      needTagsView: (state) => state.settings.tagsView,
      fixedHeader: (state) => state.settings.fixedHeader,
    }),
    classObj() {
      return {
        hideSidebar: !this.sidebar.opened,
        openSidebar: this.sidebar.opened,
        withoutAnimation: this.sidebar.withoutAnimation,
        mobile: this.device === 'mobile',
      }
    },
  },
}
</script>

<style lang="scss" scoped>
@import '~@/styles/mixin.scss';
@import '~@/styles/variables.scss';
.bodyWrap {
  position: relative;
  height: 100%;
  width: 100%;
}
.app-wrapper {
  @include clearfix;
  position: relative;
  display: flex;
  align-items: center;
  padding-top: 20px;
  width: 100%;
  height: calc(100% - 90px);
}

.drawer-bg {
  background: #000;
  opacity: 0.3;
  width: 100%;
  top: 0;
  height: 100%;
  position: absolute;
  z-index: 999;
}

.fixed-header {
  position: fixed;
  top: 0;
  right: 0;
  z-index: 9;
  width: calc(100% - #{$sideBarWidth});
  transition: width 0.28s;
}

.hideSidebar .fixed-header {
  width: calc(100% - 54px);
}

.mobile .fixed-header {
  width: 100%;
}
</style>
