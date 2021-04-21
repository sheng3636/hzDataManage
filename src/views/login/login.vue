<template>
  <div class="loginContainer">
    <h3 class="logoWrap">
      <img src="../../assets/customImages/hz2.png">
      <span>市县经济社会发展现状分析-数据管理系统</span>
    </h3>
    <div class="loginFormWrap">
      <p class="head">登录/Login</p>
      <el-form ref="loginForm" :model="loginForm" :rules="loginRules" class="loginForm" autocomplete="on"
        label-position="left">
        <el-form-item prop="username">
          <span class="spanLabel">用户:</span>
          <el-input ref="username" v-model="loginForm.username" placeholder="请输入用户名" type="text" tabindex="1"
            autocomplete="on" />
        </el-form-item>
        <el-form-item prop="password">
          <span class="spanLabel">密码:</span>
          <el-input ref="password" type="password" v-model="loginForm.password" placeholder="请输入密码" tabindex="2" autocomplete="on" />
        </el-form-item>
        <el-form-item prop="code" class="verificationCodeRow">
          <span class="spanLabel">验证码:</span>
          <el-input ref="verificationCode" v-model="loginForm.code" placeholder="请输入验证码" type="text" tabindex="3"
            @keyup.enter.native="handleLogin" />
          <img :src="verificationCodeImgUrl" @click="refreshCode" />
        </el-form-item>
        <el-button :loading="loading" type="primary" @click.native.prevent="handleLogin">登 录</el-button>
      </el-form>
    </div>
    <span class="versionsTxt">1.1.5.210208B</span>
  </div>
</template>

<script>
import { getVerifyCode } from '@/api/user'
export default {
  name: 'Login',
  data() {
    return {
      loginForm: {
        // 登录表单参数
        username: '',
        password: '',
        code: '',
        captchaId: '',
        saveLogin: false,
        logType: "2"
      },
      verificationCodeImgUrl: '', // 验证码图片地址
      loginRules: {
        // 登录表单校验规则
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
        ],
        password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
        code: [{ required: true, message: '请输入验证码', trigger: 'blur' }],
      },
      loading: false, // 登录按钮上显示加载状态
      redirect: undefined,
      otherQuery: {},
    }
  },
  watch: {
    $route: {
      handler: function (route) {
        const query = route.query
        if (query) {
          this.redirect = query.redirect
          this.otherQuery = this.getOtherQuery(query)
        }
      },
      immediate: true,
    },
  },
  mounted() {
    if (this.loginForm.username === '') {
      this.$refs.username.focus()
    } else if (this.loginForm.password === '') {
      this.$refs.password.focus()
    }
    this.refreshCode()
  },
  methods: {
    // 刷新验证码
    refreshCode() {
      getVerifyCode().then((res) => {
        let data = res.data
        this.loginForm.captchaId = data
        this.verificationCodeImgUrl = `${process.env.VUE_APP_BASE_API}common/captcha/draw/${data}`
        console.log(this.verificationCodeImgUrl)
      })
    },
    // 登录表单提交
    handleLogin() {
      this.$refs.loginForm.validate((valid) => {
        if (valid) {
          this.loading = true
          this.$store
            .dispatch('user/login', this.loginForm)
            .then((res) => {
              console.log(res)
              this.$router.push({
                // path: this.redirect || '/',
                path: '/',
                query: this.otherQuery,
              })
              this.loading = false
            })
            .catch(() => {
              this.refreshCode()
              this.loading = false
            })
        } else {
          console.log('错误提交!!')
          return false
        }
      })
    },
    getOtherQuery(query) {
      return Object.keys(query).reduce((acc, cur) => {
        if (cur !== 'redirect') {
          acc[cur] = query[cur]
        }
        return acc
      }, {})
    },
  },
}
</script>

<style lang="scss">
.loginForm {
  padding: 30px;
  .el-form-item__content {
    display: flex;
    justify-content: flex-start;
    align-items: center;
  }
  .spanLabel {
    display: inline-block;
    margin-right: 10px;
    width: 75px;
    font-size: 18px;
    color: #292929;
    text-align: right;
  }
  .verificationCodeRow {
    .el-input {
      width: 450px;
    }
    img {
      margin-left: 5px;
      width: 70px;
      height: 36px;
    }
  }
  .el-button--primary {
    padding: 18px 30px;
    width: 100%;
    margin-bottom: 30px;
    font-size: 24px;
    background-color: #d70029;
    border-color: #d70029;
  }
}
</style>
<style lang="scss" scoped>
@import './login.scss';
</style>
