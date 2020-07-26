export default {
  methods: {
    checkAuth () {
      // #ifdef MP-WEIXIN
			// 获取是否授权状态, 没授权跳登录页
			try {
				const token = uni.getStorageSync('token');
				if (token === '' || token === undefined || token === null) {
					uni.getSetting({
						success: (res) => {
							let status = res.authSetting['scope.userInfo']
							this.$store.commit('SET_INFO', status)
							if (!status) {
								uni.redirectTo({
									url: '/pages/auth/auth'
								})
								return false
							} else {
								return true
							}
						}
					})
				} else {
					return true
				}
			} catch (err) {
        return true
      }
			return true
			// #endif
    }
  }
}