<template>
	<view>
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
		<ad-custom unit-id="adunit-776df3313d212806"></ad-custom>
		<!-- #endif -->
	</view>
</template>

<script>
	import uCharts from '../../components/u-charts/u-charts.js'
	import { searchIron } from '../../api/api.js'
	import chart from '../mixin/chart.js'
	export default {
		mixins: [chart],
		data() {
			return {
				ironName: '',
				ironObj: {},
				infoArr: []
			}
		},
		onShareAppMessage() {
			return {
				title: '钢材详细信息',
				path: '/pages/details/details'
			}
		},
		onLoad: function (option) {
			this.ironName = option.ironName
			uni.showLoading({
				title: '加载中'
			})
			this.getIronData()
		},
		onShareAppMessage() {
			return {
				title: '钢材信息详情',
				path: `/pages/details/details?ironName=${this.ironName}`
			}
		},
		methods: {
			getIronData() {
				searchIron(this.ironName).then(res => {
					uni.hideLoading();
					if(res.code === 500) {
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
.chart {
	height: 500upx;
	display: flex;
	flex: 1;
}
.the-chart {
	width: 100%;
	height: 500upx;
	display: flex;
	flex: 1;
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
</style>
