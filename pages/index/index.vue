<template>
	<view class="container">
		<view class="search">
			<my-header title="钢材搜索" :showGif="false" :scroll="true" @select="checkoutIron"></my-header>
			<!-- <search  @search="searchIron" :disabled="btnDisable"/> -->
			<view class="the-search">
				<view class="search-input" @click="toToSearch">搜索钢材</view>
				<image src="https://zzes-1251916954.cos.ap-shanghai.myqcloud.com/wave.gif" class="wave-gif" mode=""></image>
			</view>
		</view>
		<scroll-view scroll-y style="height: 450px;">
			<view class="chart">
				<!--#ifdef MP-ALIPAY -->
				<canvas canvas-id="chart" id="chart" class="the-chart" disable-scroll=true @touchstart="touchLine" @touchmove="moveLine" @touchend="touchEndLine" :style="{'width':cWidth*pixelRatio+'px','height':cHeight*pixelRatio+'px', 'transform': 'scale('+(1/pixelRatio)+')','margin-left':-cWidth*(pixelRatio-1)/2 +'px','margin-top':-cHeight*(pixelRatio-1)/2+'px'}"></canvas>
				<!--#endif-->
				<!-- #ifndef MP-ALIPAY -->
				<canvas canvas-id="chart" id="chart" class="the-chart" disable-scroll=true @touchstart="touchLine" @touchmove="moveLine" @touchend="touchEndLine"></canvas>
				<!-- #endif -->
			</view>
			<view>
				<slider :value="zoomCount" min="5" :max="zoomMax" block-color="#f8f8f8" block-size="18" @changing="sliderMove" @change="sliderMove"/>
			</view>
			<view class="details-card" v-for="(ironObj, i) in infoArr" :key="i">
				<image class="card-header" :src="ironObj.photo !== ''&&ironObj.photo !== null ? ironObj.photo : 'https://zzes-1251916954.cos.ap-shanghai.myqcloud.com/Ocean.jpg'"></image>
				<view class="card-body">
					<view class="card-name">
						<view>{{ironObj.name}}</view>
						<view class="new-price">{{ironObj.new_price}}元/吨</view>
					</view>
					<view class="card-intro">
						<view>{{ironObj.intro}}</view>
					</view>
					<view class="card-footer">
						{{ironObj.updatedAt | formatDate}}
					</view>
				</view>
			</view>
			<!--  #ifdef  MP-WEIXIN -->
			<ad unit-id="adunit-e33e3aad6c575346" ad-type="grid" grid-opacity="0.8" grid-count="5" ad-theme="black"></ad>
			<!-- #endif -->
		</scroll-view>
	</view>
</template>

<script> 
	import MyHeader from '../../components/my-header.vue'
	import { searchIron } from '../../api/api.js'
	import auth from '../mixin/auth'
	import chart from '../mixin/chart'
	
	export default {
		name: 'SearchIndex',
		mixins: [auth, chart],
		data() {
			return {
				btnDisable: false,
				ironName: '螺纹(22mm)',
				current: 0,
				options: null,
				ironObj: {},
				infoArr: []
			}
		},
		components:{
			MyHeader
		},
		onLoad() {
			uni.showLoading({
				title: '加载中'
			})
			this.getIronData(this.ironName)
		},
		onShow: function () {
			try {
				const name = uni.getStorageSync('ironName');
				if (name&&name!=='') {
					this.ironName = name
					this.getIronData(this.ironName)
					uni.setStorageSync('ironName', '');
				}
			} catch (e) {
				// error
			}
		},
		onShareAppMessage() {
			return {
				title: '钢材信息搜索',
				path: '/pages/index/index'
			}
		},
		methods: {
			/**
			 * 顶部tab点击事件
			 */
			checkoutIron(v) {
				this.getIronData(v.name)
			},
			call(num) {
				uni.makePhoneCall({
					phoneNumber: num
				});
			},
			getIronData(iron) {
				searchIron(iron).then(res => {
					uni.hideLoading()
					if(res.data.code === 500) {
						uni.showToast({
							title: res.data,
							duration: 2000,
							icon: 'none'
						});
					} else {
						let result = res.data
						let dataArr = []
						this.infoArr = result.map(v => {
							let obj = {
								name: '',
								data: []
							}
							obj.name = v.name
							v.old_price.map(d => {
								obj.data.push(d.price)
							})
							dataArr.push(obj)
							return v
						})
						let x = result[0].old_price.map(v => {
							let date = new Date(v.createdAt)
							let myDate = (date.getMonth() + 1) + '-' + date.getDate() 
							return myDate
						})
						this.chartName = result[0].name
						this.xaxis = x
						this.theSeries = dataArr.map(v => {
							return {
								name: `${v.name}价格`,
								data: v.data,
								type: 'line',
								legendShape: 'rect',
								pointShape: 'rect',
								color: '#2fc25b'
							}
						})
						this.initCharts('chart')
					}
				})
				.catch(e => {
					uni.hideLoading()
				})
			},
			
			searchIron(search) {
				this.ironName = search.name
				this.getIronData()
			},
			toToSearch() {
				console.log('tosearch')
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
			}
		},
		filters: {
			formatDate (v) {
				let date = new Date(v)
				return date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDay()
			}
		}
	}
</script>

<style>
	.container {
		display: flex;
		flex-direction: column;
	}
	.header {
		background: transparent;
	}
	.the-chart {
		width: 100%;
		height: 500upx;
		display: flex;
		flex: 1;
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
	.the-search {
		position: relative;
		display: flex;
		justify-content: center;
		height:100rpx;
		padding: 40upx 24upx 54upx;
		background-color: #00BFFF;
		background-repeat: no-repeat;
		background-position-y:39px;

	}
	.the-search .search-input {
		-webkit-box-flex: 1;
		-ms-flex: 1;
		flex: 1;
		height: 74upx;
		display: -webkit-box;
		display: -ms-flexbox;
		display: flex;
		-webkit-box-align: center;
		-ms-flex-align: center;
		align-items: center;
		outline: none;
		border-radius: 18upx;
		border: none;
		padding-left: 126upx;
		font-size: 28upx;
		color: #323232;
		background-color: #fff;
		background-image: url(data:image/png;base64,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);
		background-repeat: no-repeat;
		background-size:54upx 50upx;
		background-position:55upx 13upx;

	}
	.details-card {
      margin: 62upx 89upx;
      border-radius: 1px;
      box-shadow: 0 1px 2px rgba(0,0,0,.3);
      background: #fff;
      color: #333;
    }
    .card-header {
		background-size: cover;
		background-position: 50%;
		height:368upx;
		width:100%;
		color: #f2f2f2;
    }
    .card-body {
      /* padding: 35upx 90upx; */
      line-height: 1.6;
    }
	.card-body .card-name {
		border-bottom: 1upx solid #eee;
		padding:15upx 40upx;
		display: flex;
		justify-content: space-between;
	}
	.card-body .card-intro {
		padding:15upx 40upx;
		min-height: 120upx;
	}
	.card-body .card-footer {
		padding:15upx 40upx;
		text-align: right;
		font-size: 24upx;
		color: #999;
	}
	.details {
		display: flex;
		justify-content: center;
		border:1upx solid #dfdfdf;
		border-radius:20upx;
		padding:10upx;
		margin:0 20upx;
		margin-bottom: 20upx;
	}
	.details-infos .iron-photo {
		width: 300upx;
		height: 300upx;
		margin-left: 15upx;
	}
	.details .details-text {
		display: flex;
		flex-direction: column;
		justify-content: center;
		line-height: 2;
	}
	.details-info {
		display: flex;
		flex-direction: column;
		justify-content: flex-start;
	}
	.new-price {
		color: #007AFF;
	}
	.details-title {
		padding:8rpx 0;
		text-align:center;
		background:#dfdfdf;
		color:#323232;
		margin:20rpx 0;
	}
	.iron-contact {
		text-align: center;
	}
	.qrcodes {
		text-align: center;
	}
	.qrcodes .qrcode {
		width: 200rpx;
		height: 200rpx;
	}
	.iron-contact {
		text-align: center;
	}
	.qrcodes {
		text-align: center;
	}
	.qrcodes .qrcode {
		width: 200rpx;
		height: 200rpx;
	}
</style>
