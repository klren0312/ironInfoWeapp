<script>
	import Vue from 'vue'
	import { countUser, getHotIron, login } from 'api/api.js'
	export default {
		onLaunch: function () {
			console.log('App Launch')
			this.getStatusBarInfo()
			// #ifdef MP-WEIXIN
			this.getInfo()			
			// #endif
		},
		onShow: function () {
			console.log('App Show')
		},
		onHide: function () {
			console.log('App Hide')
		},
		methods: {
			getInfo() {
				uni.getSetting({
					success: (res) => {
						let status = res.authSetting['scope.userInfo']
						this.$store.commit('SET_INFO', status)
						console.log(status)
						if (status) {
							uni.getUserInfo({
								success: (res) => {
									this.getOpenId(res)
									// 更新访问记录
									let openId = uni.getStorageSync('openId')
									let history = uni.getStorageSync('hot') ? uni.getStorageSync('hot') : '{}'
									countUser(openId, JSON.parse(history)).then(res => {
										console.log(res.data)
									}).catch(e => {})
									// 存储头像信息
									this.$store.commit('SAVE_INFO', res.userInfo)
								}
							})
						}
					}
				})
			},
			getStatusBarInfo () {
				uni.getSystemInfo({
					success: function(e) {
						// #ifndef MP
						Vue.prototype.StatusBar = e.statusBarHeight;
						if (e.platform == 'android') {
							Vue.prototype.CustomBar = e.statusBarHeight + 50;
						} else {
							Vue.prototype.CustomBar = e.statusBarHeight + 45;
						};
						// #endif
				
						// #ifdef MP-WEIXIN
						Vue.prototype.StatusBar = e.statusBarHeight;
						let custom = wx.getMenuButtonBoundingClientRect();
						Vue.prototype.Custom = custom;
						Vue.prototype.CustomBar = custom.bottom + custom.top - e.statusBarHeight;
						// #endif		
				
						// #ifdef MP-ALIPAY
						Vue.prototype.StatusBar = e.statusBarHeight;
						Vue.prototype.CustomBar = e.statusBarHeight + e.titleBarHeight;
						// #endif
					}
				})
			},
			getOpenId(info) {
				console.log(info)
				const {
					encryptedData,
					iv,
					signature
				} = info
				uni.login({
					provider: 'weixin',
					success: (loginRes) => {
						// 获取用户信息
						uni.getUserInfo({
							provider: 'weixin',
							lang: 'zh_CN',
							success: (infoRes) => {
								const {
									encryptedData,
									iv,
									signature
								} = infoRes
								login(encryptedData, iv, signature, loginRes.code).then(res => {
									uni.setStorageSync('token', res.token)
									uni.setStorageSync('openId', res.openId)
									this.$store.commit('SET_INFO', true)
								}).catch(e => {
									if (e.hasOwnProperty('token')) {
										uni.setStorageSync('token', e.token)
										uni.setStorageSync('openId', e.openId)
										this.$store.commit('SET_INFO', true)
									}
								})
							}
						})
					}
				})
			}
		}
	}
</script>

<style>
	@import 'common/uni.css';

	@font-face {
		font-family: iconfont;
		src: url('~@/static/iconfont.ttf');
	}

	/*每个页面公共css */
	page {
		min-height: 100%;
		display: flex;
		flex-direction: column;
		/* justify-content: center; */
	}

	.iconfont {
		font-family: iconfont;
	}


	.wave-gif {
		position: absolute;
		width: 100%;
		bottom: 0;
		left: 0;
		z-index: 99;
		mix-blend-mode: screen;
		height: 100upx;
	}
</style>