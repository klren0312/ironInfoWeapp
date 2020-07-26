<template>
	<view class="login-block">
		<view class="title">绑定用户</view>
		<input type="text" class="the-input" v-model="username" placeholder="请输入用户名">
		<input type="password" class="the-input" v-model="password" placeholder="请输入密码">
		<button class="login-btn" type="primary" @click="toBind">绑定</button>
	</view>
</template>

<script>
	import { bindUser } from '@/api/api.js'
	export default {
		data() {
			return {
				username: '',
				password: ''
			}
		},
		methods: {
			toBind() {
				if (!this.username) {
					uni.showToast({
						icon: 'none',
						title: '用户名不能为空'
					})
					return
				}
				if (!this.password) {
					uni.showToast({
						icon: 'none',
						title: '密码不能为空'
					})
					return
				}
				const openId =  uni.getStorageSync('openId')
				bindUser(this.username, this.password, openId).then(res => {
					uni.showToast({
						icon: 'success',
						title: res.message
					})
					uni.switchTab({
						url: '/pages/home/home'
					})
				})
			}
		}
	}
</script>

<style>
.login-block {
	padding: 0 40px;
	text-align: center;
}
.title {
	padding: 40px 0;
	font-size: 40rpx;
}
.the-input {
	height: 100rpx;
	margin: 0 auto 20rpx;
	border-bottom: 1rpx solid #999;
}
.login-btn {
	margin-top: 40rpx;
	width: 100%;
}
</style>
