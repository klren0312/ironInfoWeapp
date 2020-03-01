<template>
	<view>
		<view class="dashboard">
			<view class="weight">
				<text class="number">{{currentWeight}}</text><text class="unit"> 千克</text>
			</view>
		</view>
		<view class="setting-form">
			<view class="setting-input" :class="currentInput === 0 ? 'active' : ''">
				<view class="setting-label">
					类型
				</view>
				<picker class="iron-picker" mode="selector" :range="ironArr" @change="ironSelectHandler">
					<view>{{selectIron}}</view>
				</picker>
			</view>
			<view class="setting-input" @click="currentInput = 1" :class="currentInput === 1 ? 'active' : ''">
				<view class="setting-label">
					直径 (mm)
				</view>
				<view class="iron-number">{{currentCalc.radius}}</view>
			</view>
			<view class="setting-input" @click="currentInput = 2" :class="currentInput === 2 ? 'active' : ''">
				<view class="setting-label">
					长度 (m)
				</view>
				<view class="iron-number">{{currentCalc.length}}</view>
			</view>
			<view class="setting-input" @click="currentInput = 3" :class="currentInput === 3 ? 'active' : ''">
				<view class="setting-label">
					价格 (元/吨)
				</view>
				<view class="iron-number">{{currentCalc.price}}</view>
			</view>
			<view class="setting-input">
				<view class="setting-label">
					参考价格 (元)
				</view>
				<view class="iron-number">≈ {{totalPrice}}</view>
			</view>
		</view>
		<view class="keyboard">
			<view class="key" hover-class="key-hover" @click="set(1)">1</view>
			<view class="key" hover-class="key-hover" @click="set(2)">2</view>
			<view class="key" hover-class="key-hover" @click="set(3)">3</view>
			<view class="key" hover-class="key-hover" @click="set('AC')">AC</view>
			<view class="key" hover-class="key-hover" @click="set(4)">4</view>
			<view class="key" hover-class="key-hover" @click="set(5)">5</view>
			<view class="key" hover-class="key-hover" @click="set(6)">6</view>
			<view class="key" hover-class="key-hover" @click="next">下一项</view>
			<view class="key" hover-class="key-hover" @click="set(7)">7</view>
			<view class="key" hover-class="key-hover" @click="set(8)">8</view>
			<view class="key" hover-class="key-hover" @click="set(9)">9</view>
			<view class="key" hover-class="key-hover" @click="set('backspace')">
				<view class="backspace"></view>
			</view>
			<view class="key key-3-4" hover-class="key-hover" @click="set(0)">0</view>
			<view class="key" hover-class="key-hover" @click="cleanCurrent">清空</view>
		</view>
	</view>
</template>

<script>
// #ifdef MP-WEIXIN
// 在页面中定义插屏广告
let interstitialAd = null
// #endif

export default {
	name: 'Calc',
	data () {
		return {
			selectIron: '螺纹钢',
			ironArr: ['螺纹钢', '盘螺', '圆钢'],
			ironCalcObj: {
				'螺纹钢': 0.00617,
				'盘螺': 0.00617,
				'圆钢': 0.006165
			},
			currentCalc: {
				radius: 0,
				length: 0,
				price: 0,
				param: 0
			},
			inputObj: {
				1: 'radius',
				2: 'length',
				3: 'price'
			},
			currentWeight: 0,
			currentInput: 0,
			totalPrice: 0
		}
	},
	onLoad () {
		this.currentCalc.param = this.ironCalcObj[this.selectIron]
		// #ifdef MP-WEIXIN
		// 在页面onLoad回调事件中创建插屏广告实例
		if (wx.createInterstitialAd) {
		  interstitialAd = wx.createInterstitialAd({
		    adUnitId: 'adunit-34fec84c45de31e8'
		  })
		  interstitialAd.onLoad(() => {})
		  interstitialAd.onError((err) => {})
		  interstitialAd.onClose(() => {})
		}
		
		// 在适合的场景显示插屏广告
		if (interstitialAd) {
		  interstitialAd.show().catch((err) => {
		    console.error(err)
		  })
		}
		// #endif
	},
	onShareAppMessage() {
		return {
			title: '钢材信息首页',
			path: '/pages/home/home?page=/pages/calc/calc'
		}
	},
	methods: {
		ironSelectHandler (e) {
			this.selectIron = this.ironArr[parseInt(e.detail.value)]
			this.cleanCurrent()
		},
		cleanCurrent () {
			this.currentCalc = {
				radius: 0,
				length: 0,
				price: 0,
				param: this.currentCalc.param = this.ironCalcObj[this.selectIron]
			}
		},
		set (n) {
			if (this.currentInput === 0) return
			const current = this.inputObj[this.currentInput]
			let makeNum = this.currentCalc[current]
			switch(n) {
				case 'backspace':
					const num = this.currentCalc[current]
					makeNum = (num - num % 10) / 10
					break
				case 'AC':
					makeNum = 0
				  break
				default:
					makeNum = makeNum * 10 + n
			}
			if (current === 'radius' && makeNum > 999) {
				uni.showToast({
					title: '数字太大了?',
					duration: 2000,
					icon: 'none'
				})
				return
			}
			this.currentCalc[current] = makeNum
		},
		next () {
			if (this.currentInput === 3) {
				this.currentInput = 0
			}
			this.currentInput++
		}
	},
	watch: {
		currentCalc: {
			handler: function () {
				const { radius, length, param } = this.currentCalc
				this.currentWeight = (Math.sqrt(radius) * length * param).toFixed(2)
			},
			deep: true
		},
		'currentCalc.price' () {
			this.totalPrice = this.currentCalc.price * this.currentWeight
		}
	}
}
</script>

<style lang="scss">
.dashboard {
	display: flex;
	justify-content: center;
	align-items: center;
	height: 200upx;
	background: #000131;
	color: #fff;
	font-size: 44upx;
	.number {
		font-size: 100upx;
		font-weight: bold;
	}
}
.setting-form {
	.iron-picker {
		width: 72%;
		display: block;
		text-align: right;
	}
	.setting-input {
		display: flex;
		justify-content: space-between;
		padding: 0 40upx;
		height: 100upx;
		line-height: 100upx;
		border-bottom: 1upx solid #eee;
		.setting-label {
			font-weight: bold;
		}
		&.active {
			background-color: #fcd052;
		}
	}
}
.dashboard {
	display: flex;
	justify-content: center;
	align-items: center;
	height: 200upx;
	background: #fff;
	color: #111a34;
	font-size: 44upx;
	.number {
		font-size: 100upx;
		font-weight: bold;
	}
}
.keyboard {
	position: fixed;
	width: 100%;
	height: 428upx;
	bottom: 0;
	&::after {
		content: '';
		display: block;
		clear: both;
	}
	.key {
		position: relative;
		width: 25%;
		height: 107upx;
		padding-top: 5upx;
		float: left;
		line-height: 107upx;
		text-align: center;
		background: #ffffff;
		color: #111a34;
		box-sizing: border-box;
		transition: background .3s;
		&.key-3-4 {
			width: 75%;
		}
		.backspace {
			position: absolute;
			left: 0;
			right: 0;
			top: 0;
			bottom: 0;
			margin: auto;
			width: 64upx;
			height: 76upx;
			background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAACCklEQVRYR+2Wv2vUYBjHv8974lXBkmRq33ZwEKmoIOYtpXRonQoOokiLQztZxKV/QB0KTjrrKDjYodBS3QS7tKCCksTJQUEoBfum1uvlVLBDaZ6Sg1ylepdcTgzCZcmQPO/3836fH+9LyPmhnPXRBmg78H84YHSpERK4Dsa5LF3DwFcQv6xo7+Hh+EQHrK7+syz4fTWQsZoFAIQTAGwiHi9veIu/rtEQwLIGOrlj7xtAGyLEte1Nx8kEAMCU9hozORXfHU8NYEj1kYDTBB4ta285q3gUZ3arlegd+O6lVABmj5oDY4KYbpV951Er4k0DWNK+y6BZMN0JfOdePfHO3ounvn9+9yn+bpy8YBzhwrHSuucfjkntgCHtaQI9YOBxRbs364kb3WqBCGNxYUUwBRbPok4JtPtbbaUCMKW6AWAe4BeB9i4DCBtZX12UMALCbWJMMaD+VOmpU1DdFdBX2C0OlUqvf6TJuynVKwBD0b/1xJsDIIwJ8Jlt7X1IApDSPr4D8RTg0b8CcJACINBuISEFwpRqCcBViHASLKbAGG4pBdEu4iIE6E2gncEGRThJhCexoNUz0Mvh3nMQzmcuwlis1oag+4F2Zpppw6M/i8WtrbdfMrdhHJjrIKoNljxHcQRxcBhhU4R05Z8fRlWIPI/jWiryvJAkDaNWvyfeiFoVSIpvA7QdyN2Bff/DDDAYuz04AAAAAElFTkSuQmCC);
			background-repeat: no-repeat;
		}
		&::after {
			content: "";
			position: absolute;
			z-index: 2;
			-webkit-transform-origin: 100% 50%;
			transform-origin: 100% 50%;
			-webkit-transform: scaleY(.5) translateY(-100%);
			transform: scaleY(.5) translateY(-100%);
			top: 0;
			left: 0;
			right: auto;
			bottom: auto;
			width: 100%;
			border-top: 2px solid #e2e4ea;
			-webkit-transform-origin: 50% 0;
			transform-origin: 50% 0
		}
		&::before {
			content: "";
			position: absolute;
			z-index: 2;
			-webkit-transform: scaleX(.5) translateX(100%);
			transform: scaleX(.5) translateX(100%);
			top: 0;
			right: 0;
			left: auto;
			bottom: auto;
			border-right: 2px solid #e2e4ea;
			height: 100%;
			-webkit-transform-origin: 100% 50%;
			transform-origin: 100% 50%;
		}
	}
	.key-hover {
		background-color: #f9fafb;
	}
}
</style>
