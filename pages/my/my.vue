<template>
	<view class="my-container">
		<view class="header">
			<view class="user-info">
				<image class="avatar" :src="avatar"></image>
				<text class="username">{{username}}</text>
			</view>
		</view>
		<button v-if="!isLogin" class="login-btn" @click="toLogin" open-type="getUserInfo" @getuserinfo="onGotUserInfo">点击登录</button>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				username: '用户名',
				avatar: null,
				isLogin: false
			}
		},
		methods: {
			toLogin: function() {
				uni.login({
					provider: 'weixin',
					success: function (loginRes) {
						if(loginRes.errMsg === 'login:ok') {
							this.isLogin = true
						}
					}.bind(this)
				}) 
			},
			onGotUserInfo: function(res) {
				let userInfo = res.detail.userInfo
				this.avatar = userInfo.avatarUrl
				this.username = userInfo.nickName
			}
		}
	}
</script>

<style>
	.my-container {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		width: 100%;
		height: 100%;
	}
	.my-container .header {
		width: 100%;
		height: 435upx;
		background: linear-gradient(45deg, #000080, #1E1E1E);
		display: flex;
		justify-content: center;
		align-items: flex-end;
	}
	.my-container .header .user-info {
		display: flex;
		flex-direction: column;
	}
	.my-container .header .user-info .avatar {
		width: 200upx;
		height: 200upx;
		margin-bottom: 50upx;
		border-radius: 50%;
		background: #EFEFF4;
	}
	.my-container .header .user-info .username {
		color: #FFFFFF;
		text-align: center;
		padding-bottom: 25upx;
	}
	.my-container .login-btn {
		width: 300upx;
		margin-top: 100upx;
		background: #007AFF;
		border: 0;
		border-radius: 2rem;
		color: #fff;
	}
</style>
