import uCharts from '../../components/u-charts/u-charts.js'
let theChart = null
export default {
	data () {
		return {
			cWidth: '',
			cHeight: '',
			pixelRatio: 1,
			xaxis: null,
			theSeries: [],
			chartName: '',
			zoomCount: 20,
			zoomMax: 80
		}
	},
	onLoad () {
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
	},
	methods: {
		initCharts(canvasId){
			theChart = new uCharts({
				$this:this,
				canvasId: canvasId,
				type: 'line',
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
					itemCount: 6
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
			});
		},
		sliderMove(e){
			this.zoomCount= e.detail.value
			this.changeChartZoom(e.detail.value)
		},
		changeChartZoom(val) {
			theChart.zoom({
				itemCount: val
			})
		}
	},
	watch: {
		zoomCount () {
			if (this.zoomCount > 10) {
				theChart.opts.xAxis.disabled = true
				theChart.opts.dataLabel = false
			} else {
				theChart.opts.xAxis.disabled = false
				theChart.opts.dataLabel = true
			}
		}
	}
}