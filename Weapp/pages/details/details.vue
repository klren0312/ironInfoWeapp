<template>
	<view>
		<view class="chart">
			<!-- #ifdef H5 -->
			<view id="h5-chart" style="width: 100%;"></view>
			<!-- #endif -->
			<!-- #ifndef H5 -->
			<mpvue-echarts
				lazyLoad
				style="width: 100%;"
				class="ec-canvas"
				@onInit="handleChart"
				ref="echarts" />
			<!-- #endif -->
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
					{{ironObj.updatedAt}}
				</view>
			</view>
		</view>
		<!-- #ifndef MP-WEIXIN -->
		<!-- 广告 -->
		<view class="iron-contact">
			<view class="info-text">感觉价格不合理？ 欢迎联系我们议价</view>
			<view class="info-text">联系电话(点击即可拨打)</view>
			<view class="phone"><view @click="call('17625456779')">17625456779</view><view @click="call('13856262575')">13856262575</view></view>
		</view>
		<view class="qrcodes">
			<image class="qrcode" src="https://s1.ax1x.com/2018/12/02/FuDQVP.jpg"></image>
			<image class="qrcode" src="https://s1.ax1x.com/2018/12/02/FuDKbt.md.jpg"></image>
		</view>
		<!-- #endif -->
	</view>
</template>

<script>
	// #ifndef H5
	import * as echarts from '../../components/echarts/echarts.common.min'
	import mpvueEcharts from '../../components/mpvue-echarts/echarts.vue'
	// #endif
	// #ifdef H5
	import * as h5echarts from '../../components/echarts/echarts.common.min'
	// #endif
	import { searchIron } from '../../api/api.js'
	export default {
		data() {
			return {
				// #ifndef H5
				echarts,
				// #endif
				// #ifdef H5
				myChart: '',
				// #endif
				xaxis: null,
				dataArr: [],
				chartName: '',
				ironName: '',
				ironObj: {},
				infoArr: []
			}
		},
		components:{
			// #ifndef H5
			mpvueEcharts
			// #endif
		},
		onShareAppMessage() {
			return {
				title: '钢材详细信息',
				path: '/pages/details/details'
			}
		},
		onLoad: function (option) {
			this.ironName = option.ironName
			this.getIronData()
			// #ifdef H5
			this.$nextTick(_ => {
				this.myChart = h5echarts.init(document.getElementById('h5-chart'));
				this.myChart.setOption({
					grid: {
						left: 60
					},
					dataZoom: [{
						type: 'slider'
					}],
					dataZoom: [{ 
						"show": true,
						fillerColor: '#f96854',
						"realtime": true, "start": 30, "end": 100, "xAxisIndex": [0], "bottom": "0"},
					],
					color: [ '#f96854','#749f83',  '#ca8622', '#bda29a','#6e7074', '#546570', '#c4ccd3'],
					legend: {
						show: true,
						top: 20,
						formatter: '{name} 历史价格图(元/吨)'
					},
					tooltip : {
						trigger: 'axis',
						axisPointer: {
							type: 'cross',
							animation: false,
							label: {
								backgroundColor: '#f96854'
							}
						},
						formatter: '时间: {b0} \n 名称: {a} \n 价格:{c0}元/吨'
					},
					xAxis: {
						type: 'category',
						data: this.xaxis
					},
					yAxis: {
						name: '价格(元/吨)',
						nameTextStyle: {
							color: '#323232'
						},
						type: 'value'
					},
					series: this.theSeries
				})
			})
			// #endif
		},
		computed: {
			theSeries: function() {
				return this.dataArr.map(v => {
					return {
						name: v.name,
						data: v.data,
						type: 'line',
						symbol:'circle',
						areaStyle: {
						}
					}
				})
			}
		},
		onShareAppMessage() {
			return {
				title: '钢材信息详情',
				path: '/pages/details/details'
			}
		},
		methods: {
			chartInit(){
				// #ifndef H5
				this.options = {
					grid: {
						left: 60
					},
					dataZoom: [{
						type: 'slider'
					}],
					dataZoom: [{ 
						"show": true,
						fillerColor: '#f96854',
						"realtime": true, "start": 30, "end": 100, "xAxisIndex": [0], "bottom": "0"},
					],
					color: [ '#f96854','#749f83',  '#ca8622', '#bda29a','#6e7074', '#546570', '#c4ccd3'],
					legend: {
						show: true,
						top: 20,
						formatter: '{name}历史价格图'
					},
					tooltip : {
						trigger: 'axis',
						axisPointer: {
							type: 'cross',
							animation: false,
							label: {
								backgroundColor: '#f96854'
							}
						},
						formatter: '时间: {b0} \n 名称: {a} \n 价格:{c0}元/吨'
					},
					xAxis: {
						type: 'category',
						data: this.xaxis
					},
					yAxis: {
						name: '价格(元/吨)',
						nameTextStyle: {
							color: '#323232'
						},
						type: 'value'
					},
					series: this.theSeries
				};
				this.$refs.echarts.init()
				// #endif
				// #ifdef H5
				this.myChart.setOption({
					xAxis: {
						type: 'category',
						data: this.xaxis
					},
					series: this.theSeries
				})
				// #endif
			},
			handleChart({canvas, width, height}) {
				echarts.setCanvasCreator(() => canvas)
				const chart = echarts.init(canvas, null, {
					width: width,
					height: height
				})
				canvas.setChart(chart)	
				chart.setOption(this.options)
				return chart
			},
			getIronData() {
				searchIron(this.ironName).then(res => {
					if(res.code === 500) {
						uni.showToast({
							title: res.data,
							duration: 2000,
							icon: 'none'
						});
					} else {
						let result = res.data
						this.dataArr = []
						this.infoArr = result.map(v => {
							let obj = {
								name: '',
								data: []
							}
							obj.name = v.name
							v.old_price.map(d => {
								obj.data.push(d.price)
							})
							this.dataArr.push(obj)
							return v
						})
						let x = result[0].old_price.map(v => {
							let date = new Date(v.createdAt)
							let myDate = (date.getMonth() + 1) + '-' + date.getDate() 
							return myDate
						})
						this.chartName = result[0].name
						this.xaxis = x
					
						this.chartInit()
					}
				})
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
