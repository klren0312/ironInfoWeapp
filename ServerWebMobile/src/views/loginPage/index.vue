<template>
  <div class="login-page">
    <div class="header-title">
      治电管理后台登录
    </div>
    <md-field>
      <md-input-item
        ref="name"
        title="用户名"
        placeholder="请输入用户名, 游客请输入 tour"
        is-title-latent
        clearable
        v-model="loginForm.username"
      ></md-input-item>
      <md-input-item
        ref="id"
        title="密码"
        type="password"
        placeholder="请输入密码, 游客请输入 tour520"
        is-title-latent
        clearable
        v-model="loginForm.password">
      </md-input-item>
    </md-field>
    <md-button class="login-btn" type="primary" @click="login">登录</md-button>
    <div class="ad-img"></div>
  </div>
</template>
<script>
import { InputItem, Field, Button, Toast } from 'mand-mobile'
import { login } from '@/apis/user.api'
export default {
  name: 'LoginPage',
  components: {
    [Button.name]: Button,
    [InputItem.name]: InputItem,
    [Field.name]: Field
  },
  data () {
    return {
      loginForm: {
        username: '',
        password: ''
      }
    }
  },
  methods: {
    login () {
      login(this.loginForm).then(res => {
        if (res) {
          Toast.succeed('登录成功')
          let user = {
            username: this.loginForm.username,
            token: res.token
          }
          this.$store.dispatch('SET_USER', user)
          this.$store.dispatch('SET_TOKEN', res.token)
          this.$storage.set('admin_user', user, 24 * 60 * 60)
          this.$router.push('/')
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.login-page {
  padding: 30px;
  .header-title {
    padding: 80px 0;
    text-align: center;
    font-size: 60px;
    font-weight: bold;
  }
  .login-btn {
    margin-top: 40px;
  }
  .ad-img {
    margin-top: 200px;
    height: 200px;
    background: url('../../assets/tlgc.png') center / contain no-repeat;
  }
}
</style>
