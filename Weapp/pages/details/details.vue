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
		<!-- #ifndef MP -->
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
	import uCharts from '../../components/u-charts/u-charts.js'
	import { searchIron } from '../../api/api.js'
	let theChart = null
	export default {
		data() {
			return {
				cWidth: '',
				cHeight: '',
				pixelRatio: 1,
				xaxis: null,
				theSeries: [],
				chartName: '',
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
			//#ifdef MP-ALIPAY
			uni.getSystemInfo({
				success: function (res) {
					if(res.pixelRatio>1){
						//正常这里给2就行，如果pixelRatio=3性能会降低一点
						//_self.pixelRatio =res.pixelRatio;
						_self.pixelRatio =2;
					}
				}
			});
			//#endif
			this.cWidth = uni.upx2px(750)
			this.cHeight = uni.upx2px(500)
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
			initCharts(canvasId){
				theChart = new uCharts({
					$this:this,
					canvasId: canvasId,
					type: 'area',
					enableScroll: true,
					dataPointShape: true,
					padding: [0, 15, 0, 15],
					colors: ['#60ACFC', '#35C5EB', '#4DBECF', '#65D5B2', '#5BC4A0', '#9DDD81', '#D4ED58', '#FFDB43', '#FEB54E', '#FF9D68'],
					legend:  {
						show: true,
						position: 'top',
						padding: 20
					},
					fontSize: 11,
					background: '#FFFFFF',
					pixelRatio: this.pixelRatio,
					animation: false,
					categories: this.xaxis,
					series: this.theSeries,
					xAxis: {
						type: 'category',
						disableGrid: true,
						scrollShow: true,
						scrollAlign: 'right',
						itemCount: 5
					},
					yAxis: {
						name: '价格(元/吨)',
						type: 'value'
					},
					dataLabel: true,
					width: this.cWidth * this.pixelRatio,
					height: this.cHeight * this.pixelRatio,
					extra: {
						column: {
							width: this.cWidth * this.pixelRatio * 0.45 /  this.xaxis.length
						},
						extra: {
							tooltip:{
								showBox:false,
								bgColor:'#000000',
								bgOpacity:0.7,
								gridType:'dash',
								dashLength:5,
								gridColor:'#1890ff',
								fontColor:'#FFFFFF',
								horizentalLine:true,
								xAxisLabel:true,
								yAxisLabel:true,
								labelBgColor:'#DFE8FF',
								labelBgOpacity:0.95,
								labelFontColor:'#666666'
							}
						}
					}
				})
			},
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
								type: 'area',
								legendShape: 'circle'
							}
						})
						this.initCharts('chart')
					}
				})
			},
			touchLine(e){
				theChart.scrollStart(e);
			},
			moveLine(e) {
				theChart.scroll(e);
			},
			touchEndLine(e) {
				theChart.scrollEnd(e);
				//下面是toolTip事件，如果滚动后不需要显示，可不填写
				theChart.touchLegend(e);
				theChart.showToolTip(e, {
					format: function (item, category) {
						return category + ' ' + item.name + ':' + item.data 
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
