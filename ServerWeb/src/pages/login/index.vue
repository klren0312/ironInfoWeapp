<template>
  <section class="login-content">
    <div class="bg"></div>
    <div class="login-form">
      <div class="title">
        {{centerTitle}}
      </div>
      <div class="form-container">
        <template v-if="!isQrcodeLogin">
          <img class="qrcode-btn" src="@/assets/login-qrcode.png" alt="二维码切换" @click="changeLoginType(true)">
          <div class="header">账号登录</div>
          <el-form class="the-form" :model="loginForm" :rules="rules" ref="loginForm" :inline="false">
            <el-form-item prop="username">
              <el-input placeholder="用户名" v-model="loginForm.username">
                <i slot="prefix" class="login-icon iconfont icon-personchoosed-copy"></i>
              </el-input>
            </el-form-item>
            <el-form-item prop="password">
              <el-input type="password" placeholder="密码" @keyup.enter.native="login()" v-model="loginForm.password">
                <i slot="prefix" class="login-icon iconfont icon-mima"></i>
              </el-input>
            </el-form-item>
            <el-form-item>
              <el-switch v-model="switchServer" inactive-text="主网" active-text="自建">
              </el-switch>
            </el-form-item>
            <el-form-item v-if="switchServer">
              <el-input v-model="customServer" placeholder="请输入自建服务地址">
              </el-input>
            </el-form-item>
            <el-form-item>
              <el-button class="login-btn" type="primary" @click="login()">登录</el-button>
            </el-form-item>
          </el-form>
        </template>
        <template v-else>
          <img class="qrcode-btn" src="@/assets/login-pc.png" alt="二维码切换" @click="changeLoginType(false)">
          <div class="header">扫码登录</div>
          <div class="qrcode-block">
            <div class="loading-block" v-loading="getQrcodeLoading" v-if="getQrcodeLoading"></div>
            <template v-else>
              <qrcode-vue :value="config.value" :size="config.size" level="H"></qrcode-vue>
              <div v-if="qrcodeInvalid" @click="getQrcode" class="invalid-block">
                 <div>
                   <p>二维码已过期</p>
                   <p>请点击重新获取</p>
                 </div>
              </div>
              <div v-if="unboundUser" @click="getQrcode" class="invalid-block">
                <div>
                  <p><i class="el-icon-circle-check" style="font-size: 40px;color: #0ce47d;"></i></p>
                  <p>已扫码, 但未绑定用户</p>
                  <p>绑定后, 请点击重新获取</p>
                </div>
              </div>
            </template>
          </div>
          <div class="qrcode-info">请使用 <strong>钢材小程序</strong> 扫码登录</div>
        </template>
      </div>
    </div>
  </section>
</template>

<script>
  import QrcodeVue from 'qrcode.vue'
  import {
    mapState
  } from 'vuex'
  import {
    login,
    getQrcodeGuid,
    getQrcodeStatus
  } from '@/api/user.api'
  export default {
    name: 'LoginPage',
     components: {QrcodeVue},
    data() {
      return {
        customServer: 'http://localhost:7001/api/v1',
        loginForm: {
          username: '',
          password: ''
        },
        rules: {
          username: [{
            required: true,
            message: '请输入用户名',
            trigger: 'blur'
          }],
          password: [{
            required: true,
            message: '请输入密码',
            trigger: 'blur'
          }]
        },
        redirect: undefined,
        switchServer: false,
        isQrcodeLogin: false,
        getQrcodeLoading: true,
        config: {
          value: '',
          size: 200
        },
        qrInterval: null,
        qrcodeGuid: '',
        qrcodeInvalid: false,
        unboundUser: false
      }
    },
    computed: {
      ...mapState({
        centerTitle: state => state.centerTitle
      })
    },
    mounted () {
    },
    methods: {
      login() {
        if (this.switchServer) {
          this.$store.dispatch('SET_SERVER', this.customServer)
        } else {
          /* eslint-disable */
          this.$store.dispatch('SET_SERVER', apiServer)
          /* eslint-enable */
        }
        this.$refs['loginForm'].validate((valid) => {
          if (valid) {
            // this.loginForm.password = md5(this.loginForm.password)
            this.loginForm.username = this.loginForm.username.trim()
            login(this.loginForm).then(res => {
              if (res) {
                this.$message.success('登录成功')
                let user = {
                  username: this.loginForm.username,
                  token: res.token
                }
                this.$store.dispatch('SET_USER', user)
                // console.log(res)
                this.$store.dispatch('SET_TOKEN', res.token)
                this.$storage.set('admin_user', user, 24 * 60 * 60)
                // console.log(this.$router)
                // this.$router.push(this.redirect || '/')
                this.$router.push('/')
              }
            }).catch(() => {
              this.$message.error('用户名或密码错误')
            });
          } else {
            return false;
          }
        });
      },
      changeLoginType (type) {
        if (type) {
          this.getQrcodeLoading = true
          this.getQrcode()
        } else {
          this.stopInterval()
        }
        this.isQrcodeLogin = type
      },
      getQrcode () {
        this.stopInterval()
        this.qrcodeInvalid = false
        this.unboundUser = false
        this.getQrcodeLoading = true
        getQrcodeGuid().then(res => {
          this.config.value = JSON.stringify({
            guid: res
          })
          this.qrcodeGuid = res
          this.getQrcodeLoading = false
          this.qrInterval = setInterval(() => {
            this.checkQrcode()
          }, 1000)
        })
      },
      checkQrcode () {
        getQrcodeStatus(this.qrcodeGuid).then(res => {
          console.log(res.status)
          if (res.status === '2222') {
            this.qrcodeInvalid = true
            this.stopInterval()
          } else if (res.status === '0000') {
            this.$message.success('登录成功')
            let user = {
              username:  res.info.username,
              token:  res.info.token
            }
            this.$store.dispatch('SET_USER', user)
            this.$store.dispatch('SET_TOKEN', res.info.token)
            this.$storage.set('admin_user', user, 24 * 60 * 60)
            this.$router.push('/')
            this.stopInterval()
          } else if (res.status === '3333') {
            this.unboundUser = true
          }
        })
      },
      stopInterval () {
        this.qrInterval && clearInterval(this.qrInterval)
      }
    },
    beforeDestroy() {
      this.qrInterval && clearInterval(this.qrInterval)
    },
    watch: {
      $route: {
        handler: function (route) {
          this.redirect = route.query && route.query.redirect
        },
        immediate: true
      }
    }
  }
</script>
<style lang="scss" scoped>
  .login-content {
    min-height: 100vh;
    width: 100%;
    background: linear-gradient(to right bottom, rgb(72, 178, 185), rgba(37, 99, 68, 0)), url(/static/img/bg2.d474627.jpg) no-repeat center;
    background-size: cover;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;

    .login-form {
      width: 500px;
      min-height: 600px;

      .title {
        color: #fff;
        font-size: 32px;
        font-weight: bold;
        width: 454px;
        line-height: 70px;
        text-align: center;
      }

      .form-container {
        position: relative;
        margin-top: 20px;
        padding-bottom: 20px;
        width: 452px;
        min-height: 436px;
        background: #fff;

        .qrcode-btn {
          position: absolute;
          right: 0;
          top: 0;
          cursor: pointer;
        }

        ::v-deep .el-input__inner {
          color: #333;
        }

        .header {
          color: #333;
          font-size: 18px;
          text-align: center;
          padding: 60px 0;
        }

        .the-form {
          padding: 0 46px;

          .login-btn {
            width: 100%;
          }
        }

        .el-input--prefix {
          margin: 0 auto 26px;
          width: 360px;
          height: 40px;
          display: block;

          .el-input__prefix {
            line-height: 40px;
            margin-left: 5px;
          }

          .el-input__inner {
            padding-left: 40px;
          }
        }

        .qrcode-block {
          position: relative;
          display: flex;
          justify-content: center;
          align-items: center;
          text-align: center;
          .invalid-block {
            display: flex;
            justify-content: center;
            align-items: center;
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            width: 200px;
            height: 200px;
            margin: auto;
            font-size: 18px;
            color: #fff;
            background: rgba(141, 141, 141, 0.7);
            cursor: pointer;
          }
        }
        .loading-block {
          width: 200px;
          height: 200px;
          border: 1px solid #dfdfdf;
        }
        .qrcode-info {
          padding: 20px 0;
          text-align: center;
        }
      }
    }
  }
</style>