<template>
	<view class="weather-container">
		<my-header title="今日天气"></my-header>
		<view class="weather">
			<image class="weather-img" :src="image[weather.code]" mode=""></image>
			<view class="weather-text">
				<view class="weather-tem">
					{{weather.temperature}}°
				</view>
				<view class="weather-title">
					{{weather.text}}
				</view>
			</view>
			<view class="date">
	 
			</view>
		</view>
		<!-- #ifndef MP-WEIXIN -->
		<view class="news">
			<view @click="goToDetails(v)" v-for="(v, i) in newsList" :key="i" class="news-item">
				<view class="title">
					{{v.title}}
				</view>
			</view>
		</view>
		<!-- #endif -->
		<!-- <image class="ad-logo" src="https://static.sencdn.com/brand/logo/logo-red-text-gray-4x.png" mode=""></image> -->
	</view>
</template>

<script>
	import MyHeader from '../../components/my-header.vue'
	import { getWeather, getNews} from '../../api/api.js'
	export default {
		components: {
			MyHeader
		},
		data() {
			return {
				newsList: [],
				weather: {},
				image: {
					0: 'https://s1.sencdn.com/web/icons/3d_50/0.png',
					1: 'https://s2.sencdn.com/web/icons/3d_50/1.png',
					2: 'https://s3.sencdn.com/web/icons/3d_50/2.png',
					3: 'https://s4.sencdn.com/web/icons/3d_50/3.png',
					4: 'https://s1.sencdn.com/web/icons/3d_50/4.png',
					5: 'https://s2.sencdn.com/web/icons/3d_50/5.png',
					6: 'https://s3.sencdn.com/web/icons/3d_50/6.png',
					7: 'https://s4.sencdn.com/web/icons/3d_50/7.png',
					8: 'https://s1.sencdn.com/web/icons/3d_50/8.png',
					9: 'https://s2.sencdn.com/web/icons/3d_50/9.png',
					10: 'https://s3.sencdn.com/web/icons/3d_50/10.png',
					11: 'https://s4.sencdn.com/web/icons/3d_50/11.png',
					12: 'https://s3.sencdn.com/web/icons/3d_50/12.png',
					13: 'https://s4.sencdn.com/web/icons/3d_50/13.png',
					14: 'https://s3.sencdn.com/web/icons/3d_50/14.png',
					15: 'https://s4.sencdn.com/web/icons/3d_50/15.png',
					16: 'https://s3.sencdn.com/web/icons/3d_50/16.png',
					17: 'https://s4.sencdn.com/web/icons/3d_50/17.png',
					18: 'https://s3.sencdn.com/web/icons/3d_50/18.png',
					20: 'https://s4.sencdn.com/web/icons/3d_50/20.png',
					21: 'https://s3.sencdn.com/web/icons/3d_50/21.png',
					22: 'https://s4.sencdn.com/web/icons/3d_50/22.png',
					23: 'https://s3.sencdn.com/web/icons/3d_50/23.png',
					24: 'https://s4.sencdn.com/web/icons/3d_50/24.png',
					25: 'https://s3.sencdn.com/web/icons/3d_50/25.png',
					26: 'https://s4.sencdn.com/web/icons/3d_50/26.png',
					27: 'https://s3.sencdn.com/web/icons/3d_50/27.png',
					28: 'https://s4.sencdn.com/web/icons/3d_50/28.png',
					29: 'https://s3.sencdn.com/web/icons/3d_50/29.png',
					30: 'https://s4.sencdn.com/web/icons/3d_50/30.png',
					31: 'https://s3.sencdn.com/web/icons/3d_50/31.png',
					32: 'https://s4.sencdn.com/web/icons/3d_50/32.png',
					33: 'https://s3.sencdn.com/web/icons/3d_50/33.png',
					34: 'https://s4.sencdn.com/web/icons/3d_50/34.png',
					35: 'https://s3.sencdn.com/web/icons/3d_50/35.png',
					36: 'https://s4.sencdn.com/web/icons/3d_50/36.png',
					37: 'https://s3.sencdn.com/web/icons/3d_50/37.png',
					38: 'https://s4.sencdn.com/web/icons/3d_50/38.png',
					99: 'https://s4.sencdn.com/web/icons/3d_50/99.png'
				}
			};
		},
		onLoad() {
			uni.showLoading({
				title: '加载中'
			})
			this.getWeather()
		},
		onShareAppMessage() {
			return {
				title: '天气',
				path: '/pages/weather/weather'
			}
		},
		methods: {
			getWeather() {
				getWeather().then(res => {
					this.weather = res.data[0].now
					uni.hideLoading()
				})
			},
			// #ifndef MP-WEIXIN
			getNews() {
				getNews('/infzm/0').then(res => {
					this.newsList = res.data.items
					uni.hideLoading()
				})
			},
			// #endif
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
.weather-container {
	background: url(https://zzes-1251916954.cos.ap-shanghai.myqcloud.com/bg.png) center no-repeat;
}
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
.weather {
	padding-top: 20%;
	height:calc(100vh - 156rpx);
	text-align: center;
}
.ad-logo {
	width:100upx;
	height:50upx;
}
@keyframes move{
	10%{
		transform: translateX(30upx);
	}
	50%{
		transform: translateX(0upx);
	}
	100%{
		transform: translateX(-30upx);
	}
}
.weather-img {
	animation: move 5s ease-in-out infinite;
}
.weather-text {
	display: flex;
	align-items: flex-end;
	justify-content: flex-start;
	height:calc(100vh - 770rpx);

}
.weather-title {
	display: inline-block;
	font-size: 60upx;
	color: #fff;
}
.weather-tem {
	display: inline-block;
	font-size: 150upx;
	color: #fff;
}
</style>
