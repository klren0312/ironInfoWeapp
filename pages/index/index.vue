<template>
	<view class="container">
		<view class="header-tab">
			<segmented-control :values="items" v-on:clickItem="onClickItem" :isDisabled='tabDisabled'></segmented-control>
		</view>
		<view class="chart">
			<mpvue-echarts lazyLoad :echarts="echarts" :onInit="handleChart" ref="echarts" />
		</view>
		<view class="news">
			<news-list :newsArr="newsArr" />
		</view>
	</view>
</template>

<script> 
	import * as echarts from '../../components/echarts/echarts.simple.min.js'
	import mpvueEcharts from '../../components/mpvue-echarts/src/echarts.vue'
	import segmentedControl from '../../components/segmented-control.vue'
	import newsList from '../../components/news-list.vue'
	export default {
		data() {
			return {
				echarts,
				tabDisabled: false,
				items: [
					'本周',
					'本月',
				],
				xaxis: null,
				dataArr: [],
				current: 0,
				options: null,
				newsArr: [{
						title: "钢材价格暴涨",
						content: "由于近日钢材价格暴涨,治电科技决定救火",
						img: "https://img-cdn-qiniu.dcloud.net.cn/uniapp/images/shuijiao.jpg?imageView2/3/w/200/h/100/q/90"
					},
					{
						title: "钢材价格暴涨",
						content: "由于近日钢材价格暴涨,治电科技决定救火",
						img: "https://img-cdn-qiniu.dcloud.net.cn/uniapp/images/muwu.jpg?imageView2/3/w/200/h/100/q/90"
					},
					{
						title: "钢材价格暴涨",
						content: "由于近日钢材价格暴涨,治电科技决定救火",
						img: "https://img-cdn-qiniu.dcloud.net.cn/uniapp/images/cbd.jpg?imageView2/3/w/200/h/100/q/90"
					}
				]
			}
		},
		components:{
			mpvueEcharts,
			segmentedControl,
			newsList
		},
		mounted(){
			this.xaxis = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
			this.dataArr = [[820, 932, 901, 934, 1290, 1330, 132]]
			this.chartInit()
		},
		computed: {
			theSeries: function() {
				return this.dataArr.map(v => {
					return {
						data: v,
						type: 'line'
					}
				})
			}
		},
		methods: {
			chartInit(){
				this.options = {
					color: ['#61a0a8', '#d48265', '#91c7ae','#749f83',  '#ca8622', '#bda29a','#6e7074', '#546570', '#c4ccd3'],
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
			onClickItem(index) {
				if (this.current !== index) {
					this.current = index;
					if(this.current) {
						this.xaxis = ['第一周', '第二周', '第三周', '第四周', '第五周', '第六周', '第七周']
						this.dataArr = [[820, 932, 901, 934, 1290, 1330, 3333]]
						this.chartInit()
					} else {
						this.xaxis = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
						this.dataArr = [[820, 932, 901, 934, 1290, 1330, 1320]]
						this.chartInit()
					}
				}
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
</style>
