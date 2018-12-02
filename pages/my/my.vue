<template>
	<view class="my-container">
		<view class="header">
			<view class="user-info">
				<image class="avatar" :src="avatar? avatar : ''"></image>
				<text class="username">{{username}}</text>
			</view>
		</view>
		<button v-if="!isLogin" class="login-btn" @click="toLogin" open-type="getUserInfo" @getuserinfo="onGotUserInfo">点击登录</button>
		<view v-else class="cards">
			<image class="card-item" src="https://s1.ax1x.com/2018/12/02/FuDQVP.jpg"></image>
			<image class="card-item" src="https://s1.ax1x.com/2018/12/02/FuDKbt.md.jpg"></image>
		</view>
		<view>感觉价格不合理？ 欢迎联系我们议价</view>
		<view>联系电话(点击即可拨打)</view>
		<view class="contact"><view @click="call('17625456779')">17625456779</view><view @click="call('13856262575')">13856262575</view></view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				username: '用户名',
				avatar: '',
				isLogin: false
			}
		},
		onShareAppMessage() {
			return {
				title: '钢材-联系我门',
				path: '/pages/my/my'
			}
		},
		methods: {
			
			call(num) {
				uni.makePhoneCall({
					phoneNumber: num
				});
			},
			toLogin: function() {
				uni.login({
					provider: 'weixin',
					success: function (loginRes) {
						if(loginRes.errMsg === 'login:ok') {
							this.isLogin = true
						}
						// 获取用户信息
						uni.getUserInfo({
						  provider: 'weixin',
						  success: (res) => {
							console.log(res.userInfo)
							this.avatar = res.userInfo.avatarUrl
							this.username = res.userInfo.nickName
							try{
								uni.request({
									url:`${this.$store.state.rootUrl}/weapp/user`,
									method: 'POST',
									data: res.userInfo
								})
							}catch(e) {
								
							}
							
						  }
						});
					}.bind(this)
				}) 
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
		height: 560upx;
		background: linear-gradient(45deg, #000080, #1E1E1E);
		display: flex;
		justify-content: center;
		align-items: center;
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
	.my-container .cards {
		display: flex;
		justify-content: center;
		align-items: center;
		padding-top: 20upx;
		width: 90%;
		height: 370upx;
		border: 1px solid #dfdfdf;
		padding: 10upx;
		margin-top:-92upx;
		margin-bottom: 10upx;
		background:#fff;
		border-radius:20upx;
	}
	.my-container .cards .card-item {
		width: 300upx;
		height: 300upx;
	}
	
	.contact {
		width:100%;
		display: flex;
		justify-content: space-around;
	}
</style>
