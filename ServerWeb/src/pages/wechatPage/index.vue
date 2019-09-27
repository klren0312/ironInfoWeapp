<template>
  <div>
    <img :src="loginQrcode" alt="微信登录二维码">
  </div>
</template>
<script>
import { weLogin, weFriends } from '@/api/wechat.api'
export default {
  name: 'WechatPage',
  data () {
    return {
      isLogin: false,
      loginQrcode: ''
    }
  },
  mounted () {
    this.getWeFriends()
  },
  methods: {
    getWeFriends () {
      weFriends().then(res => {
        if (res) {

        } else {
          this.isLogin = false
          this.getLoginQrcode()
        }
      })
    },
    getLoginQrcode () {
      weLogin().then(res => {
        if (res) {
          this.loginQrcode = res
        }
      })
    }
  }
}
</script>
<style lang="scss">
  
</style>