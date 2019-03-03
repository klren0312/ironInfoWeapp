<template>
	<view>
		<view class="login-banner">
		</view>
		<button class="login-btn" open-type="getUserInfo" @getuserinfo="getInfo">微信登录</button>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				code: ''
			};
		},
		methods: {
			getInfo(info) {
				const {encryptedData, iv, signature} = info.target
				uni.login({
				  provider: 'weixin',
				  success: (loginRes) => {
					// 获取用户信息
					uni.getUserInfo({
					  provider: 'weixin',
					  lang: 'zh_CN',
					  success: (infoRes) => {
						const {encryptedData, iv, signature} = infoRes
						wx.request({
							url: `${this.$store.state.rootUrl}/weapp/login`,
							method: 'POST',
							data: {
								crypted: encryptedData,
								iv: iv,
								signature: signature,
								code: loginRes.code
							},
							success: (res) => {
								uni.setStorageSync('token', res.data.token)
								this.$store.commit('SET_INFO', true)
								console.log("is", true)
								// 跳tabbar必须用这个...
								uni.switchTab({
									url: '/pages/home/home'
								});
							}
						})
					  }
					});
				  }
				})				
			}
		}
	}
</script>

<style>
.login-banner {
	height: 600upx;
	background: url(https://zzes-1251916954.cos.ap-shanghai.myqcloud.com/login-banner.png) center no-repeat;
	background-size:100%;
	background-position-y:0;
}
.login-btn {
	width:60%;
	margin-top:20%;
	color: #2fc67b;
	border:1px solid #2fc67b;
}
</style>
