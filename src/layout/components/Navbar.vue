<template>
  <div class="navbar">
    <div class="logoWrap">
      <img src="../../assets/customImages/hz7.png" class="user-avatar">
      <b>市县经济社会发展现状分析-数据管理系统</b>
    </div>
    <el-dropdown class="avatar-container right-menu-item hover-effect" trigger="click">
      <div class="avatar-wrapper">
        <img src="../../assets/customImages/avart.png" class="user-avatar">
        <span class="userName">{{$store.getters.name}}</span>
        <i class="el-icon-caret-bottom" />
      </div>
      <el-dropdown-menu slot="dropdown">
        <router-link to="/">
          <el-dropdown-item>首页</el-dropdown-item>
        </router-link>
        <el-dropdown-item divided @click.native="logout">
          <span style="display:block;">注销</span>
        </el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  computed: {
    ...mapGetters(['avatar']),
  },
  methods: {
    async logout() {
      await this.$store.dispatch('user/logout')
      this.$router.push(`/login?redirect=${this.$route.fullPath}`)
    },
  },
}
</script>

<style lang="scss" scoped>
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
  height: 70px;
  background: #373d41;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
  .logoWrap {
    display: flex;
    align-items: center;
    height: 100%;
    font-size: 28px;
    color: #fff;
    img {
      display: inline-block;
      margin-right: 10px;
      width: 47px;
      height: 48px;
    }
  }
  .avatar-container {
    height: 45px;
    margin-right: 30px;
    cursor: pointer;
    .avatar-wrapper {    
      display: flex;
      align-items: center;
      color: #fff;
      .userName {
        display: inline-block;
        margin:  0 5px;
        font-size: 18px;
      }
      .user-avatar {
        cursor: pointer;
        width: 40px;
        height: 40px;
        border-radius: 10px;
      }
      .el-icon-caret-bottom {
        font-size: 12px;
        color: #fff;
      }
    }
  }
}
</style>
