<script>
	export default {
		onLaunch: function () {
			console.log('App Launch')
		},
		onShow: function () {
			// #ifdef MP-WEIXIN
			// 获取是否授权状态, 没授权跳登录页
			try {
				const token = uni.getStorageSync('token');
				if (token === '' || token === undefined || token === null) {
					uni.getSetting({
						success: (res) => {
							let status = res.authSetting['scope.userInfo']
							this.$store.commit('SET_INFO', status)
							console.log(status)
							if (!status) {
								uni.redirectTo({
									url: '/pages/auth/auth'
								})
							}
						}
					})
				} else {}
			} catch (err) {}
			// #endif
			console.log('App Show')
		},
		onHide: function () {
			console.log('App Hide')
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

	.header {
		height: 210upx;
		background: #376956;
		position: fixed;
		width: 100%;
		top: 0;
		z-index: 1024;
		box-shadow: 0 1rpx 6rpx rgba(0, 0, 0, 0.1);
		text-align: center;
		line-height: 190rpx;
		color: #fff;
		font-size: 54rpx;
	}

	.go-back {
		position: absolute;
		left: 14rpx;
		/* top:68rpx; */
		color: #fff;
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