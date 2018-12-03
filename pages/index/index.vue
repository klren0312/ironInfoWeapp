<template>
	<view class="container">
		<view class="search">
			<search  @search="searchIron" :disabled="btnDisable"/>
		</view>
		<view class="chart">
			<mpvue-echarts lazyLoad :echarts="echarts" :onInit="handleChart" ref="echarts" />
		</view>
		
		<view class="details-title">钢材详情</view>
		<view class="details">
			<view class="details-text">
				<view class="details-info">
					<view>钢材名称:</view>
					<view>{{ironObj.name}}</view>
				</view>
				<view class="details-info">
					<view>钢材简介:</view>
					<view>{{ironObj.intro}}</view>
				</view>
				<view class="details-info">
					<view>最新价格:</view>
					<view class="new-price">{{ironObj.new_price}}元/吨</view>
				</view>
			</view>

			<view class="details-infos">
				<image class="iron-photo" :src="ironObj.hasOwnProperty('photo') ? ironObj.photo : 'http://placehold.it/100x100'"></image>
			</view>
		</view>
	</view>
</template>

<script> 
	import * as echarts from 'echarts'
	import mpvueEcharts from 'mpvue-echarts'
	import search from '../../components/search.vue'
	export default {
		data() {
			return {
				echarts,
				btnDisable: false,
				xaxis: null,
				dataArr: [],
				chartName: '',
				ironName: '钢',
				current: 0,
				options: null,
				ironObj: {}
			}
		},
		components:{
			mpvueEcharts,
			search
		},
		mounted(){
			this.getIronData()
		},
		computed: {
			theSeries: function() {
				return this.dataArr.map(v => {
					return {
						data: v,
						type: 'line',
						areaStyle: {
						}
					}
				})
			}
		},
		onShareAppMessage() {
			return {
				title: '钢材信息搜索',
				path: '/pages/index/index'
			}
		},
		methods: {
			
			call(num) {
				uni.makePhoneCall({
					phoneNumber: num
				});
			},
			chartInit(){
				this.options = {
					title : {
						text:  `${this.chartName}历史价格折线图`,
						x: 'center',
						align: 'right',
						top: 20
					},
					grid: {
						left: 60
					},
					dataZoom: [{
						type: 'slider'
					}],
					dataZoom: [
						{ "show": true, "realtime": true, "start": 50, "end": 100, "xAxisIndex": [0], "bottom": "0"},
					],
					color: [ '#5ee1c6','#749f83',  '#ca8622', '#bda29a','#6e7074', '#546570', '#c4ccd3'],
					legend: {
						data:['价格']
					},
					tooltip : {
						trigger: 'axis',
						axisPointer: {
							type: 'cross',
							animation: false,
							label: {
								backgroundColor: '#505765'
							}
						},
						formatter: '时间: {b0} \n 价格:{c0}元/吨'
					},
					xAxis: {
						type: 'category',
						data: this.xaxis
					},
					yAxis: {
						type: 'value'
					},
					series: this.theSeries
				};
				this.$refs.echarts.init()
			},
			handleChart(canvas, width, height) {
				const chart = echarts.init(canvas, null, {
					width: width,
					height: height
				})
				canvas.setChart(chart)	
				chart.setOption(this.options)
				return chart
			},
			getIronData() {
				uni.request({
					url: `${this.$store.state.rootUrl}/weapp/iron?name=${this.ironName}`,
					success: (res) => {
						if(res.data.code === 500) {
							uni.showToast({
								title: res.data.data,
								duration: 2000,
								icon: 'none'
							});
						} else {
							let result = res.data.data
							this.dataArr = []
							let data = []
							let x = result[0].old_price.map(v => {
								data.push(v.price)
								let date = new Date(v.createdAt)

								let myDate = (date.getMonth() + 1) + '-' + date.getDate()
								console.log('date', myDate)
								 
								return myDate
							})
							this.chartName = result[0].name
							this.dataArr.push(data)
							this.xaxis = x
							this.ironObj = {
								name: result[0].name,
								intro: result[0].intro,
								new_price: result[0].new_price,
								photo: result[0].photo
							}
							this.chartInit()
						}
						
					},
				})
			},
			searchIron(search) {
				this.ironName = search.name
				this.getIronData()
			}
		}
	}
</script>

<style>
	.container {
		display: flex;
		flex-direction: column;
	}
	.chart {
		height: 500upx;
		display: flex;
		flex: 1;
	}
	.search {
		display: flex;
		justify-content: center;
	}
	.details {
		display: flex;
		justify-content: center;
		border:1px solid #dfdfdf;
		border-radius:20rpx;
		padding:10rpx;
		margin:0 20rpx;
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
		justify-content: flex-start;
	}
	.details .new-price {
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
