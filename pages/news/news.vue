<template>
	<view>
		<view class="header">
			<view class="header-title">
				新闻资讯
			</view>
			<image src="https://zzes-1251916954.cos.ap-shanghai.myqcloud.com/wave.gif" class="wave-gif" mode=""></image>
		</view>
		<view class="news">
			<view @click="goToDetails(v)" v-for="(v, i) in newsList" :key="i" class="news-item">
				<view class="title">
					{{v.title}}
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				newsList: []
			};
		},
		onLoad() {
			this.getNews()
		},
		onShareAppMessage() {
			return {
				title: '新闻资讯',
				path: '/pages/news/news'
			}
		},
		methods: {
			getNews() {
				uni.request({
					url: `${this.$store.state.rootUrl}/weapp/news`,
					method: 'POST',
					data: {
						url: '/infzm/0'
					},
					success: (res) => {
						this.newsList = res.data.data.items
					}
				})
			},
			goToDetails(v) {
				uni.setStorageSync('article', v.content);
				uni.navigateTo({
					url: `/pages/article/article?type=news`
				})
			}
		}
	}
</script>

<style>
.header {
	background: #4CD964;
	text-align:center;
	line-height:190rpx;
	color:#fff;
	font-size:54rpx;
}
.news {
	margin-top: 220upx;
	padding: 0 20upx;
}
.news .news-item {
	box-shadow: 0 1rpx 6rpx rgba(0, 0, 0, 0.1);
	padding: 20upx;
	margin: 20upx 0;
}
.news .news-item .title {
	font-size: 28upx;
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
}
</style>
