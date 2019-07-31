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
		<swiper class="swiper hot-iron" indicator-dots>
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
					<view v-for="(v, i) in historyList" :key="i" @click="searchSome(v)" class="iron-item">
						<template v-if="v !== 'search'">
							<view class="iron-icon"></view>
							<view class="iron-name">{{v}}</view>
						</template>
						<template v-else>
							<icon type="search" size="30"/>
							<view class="iron-name">搜索钢材</view>
						</template>
					</view>
				</view>
			</swiper-item>
		</swiper>
		<!-- 公告栏 -->
		<view class="article">
			<view v-for="v in articlesList" :key="v.id" @click="seeArticle(v)" class="article-card">
				<div class="text">
					<div class="title">{{v.title}}</div>
					<div class="info">钢材信息</div>
				</div>
				<div class="date">
					<div class="year">{{v.year}}</div>
					<div class="other">{{v.month}}.{{v.day}}</div>
				</div>
			</view>
			<!--  #ifdef  MP-WEIXIN -->
			<ad unit-id="adunit-299bbc0df0e741aa"></ad>
			<!-- #endif -->
		</view>

		<!-- #ifndef MP-WEIXIN -->
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
		getArticle
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
					'https://zzes-1251916954.cos.ap-shanghai.myqcloud.com/slider11.png',
					'https://zzes-1251916954.cos.ap-shanghai.myqcloud.com/banner2.png',
					'https://zzes-1251916954.cos.ap-shanghai.myqcloud.com/banner3.png'
				],
				indicatorDots: false,
				autoplay: false,
				interval: 5000,
				duration: 1000,
				listData: [],
				articlesList: [],
				historyList: []
			};
		},
		onShareAppMessage() {
			return {
				title: '钢材信息首页',
				path: '/pages/home/home'
			}
		},
		onLoad() {
			uni.startPullDownRefresh();
			uni.showLoading({
				title: '加载中'
			})
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
			searchSome(v) {
				if (v === 'search') {
					console.log(this.checkAuth())
					if (this.checkAuth()) {
						uni.navigateTo({
							url: '/pages/search/search'
						})
					}
				} else {
					this.seeDetails(v, true)
				}
			},
			/**
			 * 查看文章
			 */
			seeArticle(v) {
				try {
					uni.setStorageSync('article', JSON.stringify(v));
					uni.navigateTo({
						url: `/pages/article/article`
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
</style>
