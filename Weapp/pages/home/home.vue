<template>
	<view>
		<my-header title="铜陵钢材信息" :showGif="false"></my-header>
		<!-- 轮播图 -->
		<swiper style="height: 466upx;" :indicator-dots="indicatorDots" :autoplay="autoplay" :interval="interval" :duration="duration">
			<swiper-item v-for="item in itemList" :key="item">
				<image class="banner-img" :src="item"></image>
			</swiper-item>
		</swiper>
		<!-- 热门钢材 -->
		<swiper class="swiper hot-iron" indicator-dots :current="currentSwiper">
			<swiper-item>
				<view class="one-line">
					<view v-for="(v, i) in listData" :key="i" @click="seeDetails(v)" class="iron-item">
						<view class="iron-icon"></view>
						<view class="iron-name">{{v.name}}</view>
					</view>
				</view>
			</swiper-item>
			<swiper-item>
				<view class="one-line">
					<view @click="toSearch" class="iron-item">
						<view class="tools-icon search-icon"></view>
						<view class="iron-name">搜索钢材</view>
					</view>
					<!-- #ifdef MP-WEIXIN -->
					<view @click="toQrcode" class="iron-item">
						<view class="tools-icon qrcode-icon"></view>
						<view class="iron-name">扫码登录</view>
					</view>
					<!-- #endif -->
					<view @click="toCalc" class="iron-item">
						<view class="tools-icon weight-icon"></view>
						<view class="iron-name">重量计算</view>
					</view>
				</view>
			</swiper-item>
		</swiper>
		<!-- 公告栏 -->
		<view class="article">
			<block v-for="(v, i) in articlesList" :key="v.id">
				<!-- #ifdef MP-WEIXIN -->
				<ad-custom v-if="i === 5" unit-id="adunit-0775fffd3cef8293"></ad-custom>
				<!-- #endif -->
				<view @click="seeArticle(v, v.id)" class="article-card">
					<div class="text">
						<div class="title">{{v.title}}</div>
						<div class="info">钢材信息</div>
					</div>
					<div class="date">
						<div class="year">{{v.year}}</div>
						<div class="other">{{v.month}}.{{v.day}}</div>
					</div>
				</view>
			</block>
		</view>
		<!-- #ifndef MP -->
		<!-- 广告 -->
		<view class="iron-contact">
			<view class="info-text">感觉价格不合理？ 欢迎联系我们议价</view>
			<view class="info-text">联系电话(点击即可拨打)</view>
			<view class="phone">
				<view @click="call('17625456779')">17625456779</view>
				<view @click="call('13856262575')">13856262575</view>
			</view>
		</view>
		<view class="qrcodes">
			<image class="qrcode" src="https://s1.ax1x.com/2018/12/02/FuDQVP.jpg"></image>
			<image class="qrcode" src="https://s1.ax1x.com/2018/12/02/FuDKbt.md.jpg"></image>
		</view>
		<!-- #endif -->
	</view>
</template>

<script>
	import MyHeader from '../../components/my-header.vue'
	import {
		getHotIron,
		getArticle,
		checkQrcode
	} from '../../api/api.js'
	import auth from '../mixin/auth.js'
	export default {
		name: 'HomePage',
		mixins: [auth],
		components: {
			MyHeader
		},
		data() {
			return {
				itemList: [
					// 'https://zzes-1251916954.cos.ap-shanghai.myqcloud.com/slider11.png',
					'https://zzes-1251916954.cos.ap-shanghai.myqcloud.com/banner2.png',
					'https://zzes-1251916954.cos.ap-shanghai.myqcloud.com/banner3.png'
				],
				indicatorDots: false,
				autoplay: false,
				interval: 5000,
				duration: 5000,
				listData: [],
				articlesList: [],
				historyList: [],
				currentSwiper: 0
			};
		},
		onShareAppMessage() {
			return {
				title: '钢材信息首页',
				path: '/pages/home/home'
			}
		},
		onLoad(option) {
			// 若从分享进入, 则跳转到分享对应页面
			if (option.hasOwnProperty('page') && option.page) {
				uni.navigateTo({
					url: option.page
				})
			}
			uni.startPullDownRefresh();
			uni.showLoading({
				title: '加载中'
			})
			this.currentSwiper = 1
			setTimeout(() => {
				this.currentSwiper = 0
			}, 3000)
		},
		onPullDownRefresh() {
			this.getArticle()
			setTimeout(function() {
				uni.stopPullDownRefresh();
			}, 1000);
		},
		onShow() {
			this.getIronList()
			this.getArticle()
			// 获取搜索历史
			let history = uni.getStorageSync('hot')
			this.historyList = []
			if(history) {
				this.historyList= [...new Set(JSON.parse(history))]
				if (this.historyList.length < 6) {
					this.historyList.push('search')
				}
			} else {
				this.historyList.push('search')
			}
		},
		methods: {
			/**
			 * 获取热门钢材
			 */
			getIronList() {
				getHotIron().then(res => {
					this.listData = res.data
					uni.hideLoading()
				})
			},
			/**
			 * 查看钢材详情
			 */
			seeDetails(v, isHistory = false) {
				uni.navigateTo({
					url: `/pages/details/details?ironName=${!isHistory ? v.name : v}`
				});
			},
			/**
			 * 搜索钢材
			 */
			toSearch(v) {
				// #ifdef MP-WEIXIN
				if (this.checkAuth()) {
					uni.navigateTo({
						url: '/pages/search/search'
					})
				}
				// #endif
				// #ifndef MP-WEIXIN
				uni.navigateTo({
					url: '/pages/search/search'
				})
				// #endif
			},
			/**
			 * 扫码登陆
			 */
			toQrcode() {
				// #ifdef MP-WEIXIN
				if (this.checkAuth()) {
					uni.scanCode({
					    success: (res) => {
							if (res.result) {
								try{
									const obj = JSON.parse(res.result)
									console.log(obj.guid)
									if (obj && obj.hasOwnProperty('guid')) {
										const openId = uni.getStorageSync('openId')
										console.log(openId)
										checkQrcode(obj.guid, openId).then(res => {
											console.log(res)
											const status = res.data
											switch(status) {
												case '1111':
													uni.showToast({
														icon: 'none',
														title: '无此用户'
													})
													break
												case '2222':
													uni.showToast({
														icon: 'none',
														title: '二维码失效'
													})
													break
												case '3333':
													uni.showToast({
														icon: 'none',
														title: '未绑定用户'
													})
													uni.navigateTo({
														url: '/pages/login/login'
													})
													break
												default:
													uni.showToast({
														icon: 'success',
														title: '扫码登录成功!'
													})
													break
											}
										})
									} else {
										uni.showToast({
											icon: 'none',
											title: '二维码无效'
										})
									}
								}catch(e){
									//TODO handle the exception
								}
							}
					    }
					});
				}
				// #endif
			},
			/**
			 * 查看文章
			 */
			seeArticle(v, id) {
				try {
					uni.setStorageSync('article', JSON.stringify(v))
					uni.navigateTo({
						url: `/pages/article/article?id=${id}`
					})
				} catch (e) {
					// error
				}
			},
			/**
			 * 获取文章
			 */
			getArticle() {
				getArticle().then(res => {
					let result = res.data.items
					let arr = []
					result.forEach(v => {
						let date = new Date(v.createdAt)
						arr.push({
							id: v.id,
							title: v.title,
							year: date.getFullYear(),
							month: date.getMonth() + 1,
							day: date.getDate(),
							content: v.content
						})
					})
					this.articlesList = arr
				})
			},
			/**
			 * 前往计算器
			 */
			toCalc () {
				uni.navigateTo({
					url: '../calc/calc'
				})
			}
		}
	}
</script>

<style>
	.header {
		background: transparent;
	}

	.banner-img {
		width: 100%;
		height: 100%;
	}

	.hot-iron .one-line {
		display: flex;
		justify-content: flex-start;
		align-items: center;
		flex-wrap: wrap;
	}

	.hot-iron .one-line .iron-item {
		width: 25%;
		height: 120upx;
		/* background: #4CD964; */
		padding: 28upx;
		text-align: center;
		background: #fff;
	}

	.hot-iron .one-line .iron-item .iron-icon {
		width: 60upx;
		height: 60upx;
		border-radius: 50%;
		background: url(https://zzes-1251916954.cos.ap-shanghai.myqcloud.com/iron-icon2.png) center no-repeat;
		background-size: contain;
		margin: 0 auto;
	}

	.hot-iron .one-line .iron-item:nth-child(even) .iron-icon {
		background: url(https://zzes-1251916954.cos.ap-shanghai.myqcloud.com/iron-icon1.png) center no-repeat;
		background-size: contain;
	}

	.hot-iron .one-line .iron-item .iron-name {
		text-align: center;
		font-size: 28upx;
		color: #323232;
		margin-top: 14upx;
	}

	.article {
		padding-top: 28upx;
	}

	.article-card {
		padding: 28upx 10upx;
		display: flex;
		justify-content: space-between;
		align-items: center;
		border-top: 1upx solid #dfdfdf;
		line-height: 2;
		background: #fff;
	}

	.article-card::last-child {
		border-bottom: 1upx solid #dfdfdf;
	}

	.article-card .text .title {
		font-size: 36upx;
		color: #323232;
		font-weight: bold;
		white-space: nowrap;
		width: 590upx;
		text-overflow: ellipsis;
		overflow: hidden;
	}

	.article-card .text .info {
		font-size: 28upx;
		color: #999;
	}

	.article-card .date {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}

	.article-card .date .year {
		font-size: 36upx;
	}

	.article-card .date .other {
		font-size: 28upx;
	}

	.iron-contact {
		text-align: center;
	}

	.qrcodes {
		text-align: center;
	}

	.qrcodes .qrcode {
		width: 200upx;
		height: 200upx;
	}
	.swiper {
		height: 400upx;
	}
	
	.flat-btn {
		padding: 0 20upx;
		position: fixed;
		bottom: 15%;
		right: 20upx;
		/* width: 200upx; */
		height: 150upx;
		line-height: 150upx;
		text-align: center;
		border-radius: 10upx;
		background: #ff0000;
		animation: blink .5s ease-in infinite;
	}
	.calc-icon {
		font-weight: bolder;
		color: #fcd052;
	}
	
	@keyframes blink{
		from{
			background: #007AFF;
		}
		to{
			background: #FF0000;
		}
	}
	.tools-icon {
		display: block;
		width: 60rpx;
		height: 60rpx;
		margin: 0 auto;
	}
	.search-icon {
		background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAEj0lEQVRYR8WWXWxUVRDH/3N2tyrRBw1stUn9ira7SyXBxirV3ruNRhOMAVFpUBJJ271bkGhQUzE+WF8wlagYPvdsISgJokRSE31QSLp3t36lEqBJ996qD5KolMKDBuWh7T1j7tY1bdnu3W2TMq9nZv6/M+fMOUO4ykZXWR9lAYSN9C0MNogRBNESMJYQqeOk6PsJ5RsYPvDQpXI3VBJAOG6uBLAGjLZZBQgjYPpIED4cSmjZUkGKAtRu7K8VjtMJoBXAPwAdI+ZBRRj0q/EzjqgQIF4OxnIA9+YggXGAdltS21IKxKwAYSP9OMAHASxmYEBAvJyVTf1uUpaLa0C+eofVNT4ff0ZtF3OlD8fNFgJtY+Y7AZy2pO6CFbWCAKF4agUxfQngRgbetaX+qpvFkcHtAJ4BcFs+q3JUc2DjxdRUlXDM3AtCB4BfLanfUYzgCoDIhr6bUSH6GAix4mftnujHnAwuU8yfABQC8BcRpxmUcRSlK+LnfygkEIllWpnUfoBes6T2zmwQVwCEjVQnQN0A91gyGnOSQQOMRC4BoUsoJSl+8ZxXaXNHEkv3gTjKrJ6wk81fFIqZBlBv/Bi4jMunAF4UEP4HBvc9OOrIILuBglVVqcJ5oVDMbCTCNwAdtaS21hPAvURgHAGo05LadicRTIBguDv3xUbfKmXXM33CMbMXhFVM3Ggnot/NXJ9WgbBh7gLwglsyq6FlQDFGGMj4jVFtLuJuTCSedrvidQZts6X2hhfAGQDLAKoarH/6HkH4ygXyGaN75goQimfWEavD+TvlBTBGwPms1KudRLAThO5CbVYOTCiWqSFSwyD63Epoq70AfgNwzpL6fSoZ7GXGKuEXQWoduVCO6FTfyKa+63lCXALjuJXUH/UCOAWgrrJKXdd367oaZ9xZ6o9fODpX8Vwrxk0NDJOBw7bUn/MCOAKgRTA3DCWjA/MRzseGY+ZLIOwAaEeh/2F6F8RST4LoGAMdttQnH595Wtgw3f/keWLRlk02HShagdrW/huE3zkLwLak3jhPbUTa0g3s4xMAJiqrVDDV1TxRFCDXt4a5k4HNYOy3knr7fCDChumKPwxGt5XUt3q+hK5D3Saz2plwn09Uk2It2xPNzAUiEk93MPNegH9XamLlcM8jgyUBuE4hI72ZwDtzAYQaK6H/XA5EXfuJSkcERibDeW1WRmftpFkHkoiRepFBH0wK0xZLaju8IG7f0HftooDYzAR3bgADXbbUi/4hRUeySDy9npnfd6cigE4A3MtKDbEKnMwPoEvbvr2Jxdj9TKhjpvVEuaf8LMC5oYWJX7ET0fdmg/ccSmfMhVPz/ARmAaK7pienQySwC4waZj70XwVjltR6Sr4DhRxDHenHoJRGRE1gNE3zIWSYOQMh0vY+zf3AchaOpTaBaHfuEBkt2aT+qWcbep1zueshw9xKwNsA/mbgKVvqX0/N4XkE5QoWrJ5hvklAF0B/EGhNVjb9P0cuCMBka09CEGBXjKkVpw82/znZpgtoeQjhD9w9tKfxlwUHyFWiPVNv9zSdzO97QStQqNj/Al2F2TC/cCLyAAAAAElFTkSuQmCC) center / contain no-repeat;
	}
	.qrcode-icon {
		background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAABhklEQVRYR+2XbUrDQBCG37Eg5BgKnsG/SesJBC9gBT2E0ag9RvUAgl5Aa+M1VOoxAqKM7JINkezHWBOCpYVC0x1mnpnZd7JL6PlDPcdHBTA84wNi3LqAmJE9TehCAjw85XMiZDZbBt4GhJOHS5qp9QpglDL7nLcFYGLMrkjHbgCoQC6Q31TA5oMIMaC/8AJIA0naUbcZpTxfA6xWBcbFQvUU19F2ItkP3j2gtGuc2DbhYfGu1zfw+TyNdnL1e1wslHRzA6BsCBwzKL+JthozwxZDPAnLbGPCVxIAyBiU2QCs0pSUrsxWS6g3AFsLzH8mW/OsgMUVSFLelVahCzvaS/mOgf0unId8EnBvADZDxl2sE/AhVkEXAD/ehq4AHvmpAaQTOCpeY8ZgXpdfOSMqG5f/YAVWCsA7CV2j2DOCveW1taC184DqueqpGcm2/tpeVK0BLKuINcD/qcCyx/K6kpY+lruCSy4m9RKHNmrjXtDG1UwI8EKM48cJ6WNdcBSHMvnreu8A393fc/5qRrtfAAAAAElFTkSuQmCC) center / contain no-repeat;
	}
	.weight-icon {
		background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAEd0lEQVRYR7VXz28bVRD+ZjfZBGiaDaAIBJSUcigSUVxAwAEprtQLEoIECYQXRFzgFGWD8xfUvSM1yVocoIAryBoBUhqBOCHFuXKgicShB0Rd8UOoAuWFFNqE2IPm7Y/uWqWyHbOX5O3zm/nezDffzBKaHtt1zgMYAzDSvLfPdQ3AhvL8iaQdSi5s1+FwrQBe36fDpuOUAWDLS+X5sd/4n6FZ5zNmvATiN9Ri5aPuOg+s2bO5k2D6kAifby76L8u7GIDtOr8RMLjp+bf9H84jm0Ouc42BLeX59zQDYICryqsc12hdJw+gG5GooY5J9a6vU2q7uVWAslEakhFoBiB82AKwXy6Mg/mcKlXkQm0DWFOenz30w1ePG0zPdZIatbhUNOyB2sHXny+bZC79sXDu/XYisGZP54owabUT5yHj0XPfMA68eEKbUN5StT0As6+ugrnYLQBbZ79Y52u7mVY4IMLxYKeOk+f6nxpF/5Oj+lXrAAqvjKBh5HsfPjRu3jmY7RQIWb2wHjkC6uttD0DI2ELPvcNT1qNHMtbRh1IY9n6+gt2LP8IYuAN9maOxA/kR7/yDnfWLaGz/BTnXc/9wfLb1CMw682C8HZ1MhlGcX13+JjZq3j2Egdyz8Xq78jXqv6t4fWDyhAbBgLflLY22QULeUF4lY7tODYxNVfKPBZLqFME4hTqOoQd5DZSN46r0SdWedjIwcQGEBRhWEfXdzU51QEjIYJRBKISdTHPBdnMFgM4AKAM8IjcSMKJ2tnCnblwSVQ1EjAognFaLvq6k1pVwJjcBojKAQa2IdWRjOS3kbdR3pJ6lbUtHiR2kIqQ3eQNmX1bNl3VOWgagfyyO9vYyEtqbVYEOt9VQav5TiVbq0ZHYNewIdLTZMgDtvL4rzUj6eBWmNRfdInHLKTAUYMwlQQY84DMAjUgKVck/3T4A15FbjwNY039TDSXulJfDIYNhWodvhNkJS4BrYZpOKs+XdLaegnA60s3IdnO6I0pFpHJsNg6LWOmKiKpg5rUsqLEa8ULb6bAbSgTGgtGMhP0r0TwXzwqMdZAes4ZgNjLChTB1UQXVQJJCnlNeZb69CAT1LIckDSswrXwTB0SopMcrMBdUqSLDrH5sXUEoag4QymrRlzIO9lodSOID006mmcnxnjAd/SoJ7MZe3gau280V0jIAO8jlckiy9FgV6MBymBrxGZMsuGVynOMqzL7JtnVAy6+M0QQJ9ak0B2IlXAmVcAxm43CCA5tagIiqQT/phAOavVgX/Q+qgGzl+fpjJe4Ft66CffaCmVwZRFOxvBEWIjKF6UmOaZdhWpmEDqSHGebJiKStcyDIcx6gCYDPR2WUZjrlQajBaMwnyaZluGEUwBgBczlVIbeogl8Avkt5lf6b6X633tlu7jpA3yvPf0JsJr8LpI5fYMZbWyX/g245TNoZnHHeJMJZMIpRf/ivj9M/Af6uuyDoMQAHAVy4fWf7mV/f+/LvVAQiZ/ojtYGnQXigqwAYP8HAt3uWOX31nY+vRLb/BZawF06dyfvAAAAAAElFTkSuQmCC) center / contain no-repeat;
	}
</style>
