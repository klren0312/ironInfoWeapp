<template>
	<view>
		<!-- 轮播图 -->
		<swiper :indicator-dots="indicatorDots" :autoplay="autoplay" :interval="interval" :duration="duration">
            <swiper-item v-for="item in itemList" :key="item">
                <image class="banner-img" :src="item"></image>
            </swiper-item>
        </swiper>
		<!-- 热门钢材 -->
		<view class="hot-iron">
			<view class="one-line">
				<view v-for="(v, i) in listData" :key="i" @click="seeDetails(v)" class="iron-item">
					<view class="iron-icon"></view>
					<view class="iron-name">{{v.name}}</view>
				</view>
			</view>
		</view>
		<!-- 公告栏 -->
		<view class="article">
			<view class="article-card">
				<div class="text">
					<div class="title">钢材今日降价</div>
					<div class="info">降价幅度较大, 我厂准备抛售</div>
				</div>
				<div class="date">
					<div class="year">2018</div>
					<div class="other">12.19</div>
				</div>
			</view>
			<view class="article-card">
				<div class="text">
					<div class="title">钢材今日降价</div>
					<div class="info">降价幅度较大, 我厂准备抛售</div>
				</div>
				<div class="date">
					<div class="year">2018</div>
					<div class="other">12.19</div>
				</div>
			</view>
			<view class="article-card">
				<div class="text">
					<div class="title">钢材今日降价</div>
					<div class="info">降价幅度较大, 我厂准备抛售</div>
				</div>
				<div class="date">
					<div class="year">2018</div>
					<div class="other">12.19</div>
				</div>
			</view>
			<view class="article-card">
				<div class="text">
					<div class="title">钢材今日降价</div>
					<div class="info">降价幅度较大, 我厂准备抛售</div>
				</div>
				<div class="date">
					<div class="year">2018</div>
					<div class="other">12.19</div>
				</div>
			</view>
			<view class="article-card">
				<div class="text">
					<div class="title">钢材今日降价</div>
					<div class="info">降价幅度较大, 我厂准备抛售</div>
				</div>
				<div class="date">
					<div class="year">2018</div>
					<div class="other">12.19</div>
				</div>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				itemList: [
					'https://zzes-1251916954.cos.ap-shanghai.myqcloud.com/banner1.png',
					'https://zzes-1251916954.cos.ap-shanghai.myqcloud.com/banner2.png',
					'https://zzes-1251916954.cos.ap-shanghai.myqcloud.com/banner3.png'
				],
				indicatorDots: false,
				autoplay: false,
				interval: 5000,
				duration: 1000,
				listData: []
			};
		},
		onShareAppMessage() {
			return {
				title: '钢材信息首页',
				path: '/pages/home/home'
			}
		},
		mounted() {
			this.getIronList()
		},
		methods: {
			/**
			 * 获取热门钢材
			 */
			getIronList() {
				uni.request({
					url: `${this.$store.state.rootUrl}/weapp/iron/option`,
					success: (res) => {
						this.listData = res.data.data
						this.listData.length = 6
					}
				})
			},
			/**
			 * 查看钢材详情
			 */
			seeDetails(v) {
				uni.navigateTo({
					url: `/pages/details/details?ironName=${v.name}`
				});
			}
		}
	}
</script>

<style>
	.banner-img {
		width: 100%;
		height: 100%;
	}
	.hot-iron .one-line {
		display: flex;
		justify-content: space-between;
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
	.hot-iron .one-line .iron-item .iron-icon{
		width: 60upx;
		height: 60upx;
		border-radius: 50%;
		background: url(https://zzes-1251916954.cos.ap-shanghai.myqcloud.com/iron-icon2.png) center no-repeat;
		background-size: contain;
		margin:0 auto;
	}
	.hot-iron .one-line .iron-item:nth-child(even) .iron-icon{
		background: url(https://zzes-1251916954.cos.ap-shanghai.myqcloud.com/iron-icon1.png) center no-repeat;
		background-size: contain;
	}
	.hot-iron .one-line .iron-item .iron-name{
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
		justify-content: space-around;
		align-items: center;
		border-top: 1px solid #dfdfdf;
	}
	.article-card::last-child {
		border-bottom: 1px solid #dfdfdf;
	}
	.article-card .text .title {
		font-size: 38upx;
		color: #323232;
		font-weight: bold;
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
		font-size: 38upx;
	}
	.article-card .date .other {
		font-size: 28upx;
	}
</style>
