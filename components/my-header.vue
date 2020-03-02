<template>
	<!-- #ifdef MP-WEIXIN -->
	<view class="my-header bg-gradual-blue" :style="{height: CustomBar + 'px'}">
		<view class="header fixed bg-gradual-blue" :style="{paddingTop: StatusBar + 'px', height: CustomBar + 'px'}">
			<view class="tab">
				<go-back v-if="goBack"></go-back>
				<image class="avatar" :src="avatar"></image>
				<view class="header-title">
					{{title}}
				</view>
				<scroll-view v-if="scroll" class="scroll-view_x" scroll-x="true"  scroll-left="120">
					<view class="scroll-view-item_x" v-for="(v,i) in listData" @click="checkoutIron(v)" :key="i">{{v.name}}</view>
				</scroll-view>
			</view>
			<slot></slot>
			<image v-if="showGif" src="https://zzes-1251916954.cos.ap-shanghai.myqcloud.com/wave.gif" class="wave-gif" mode=""></image>
		</view>
	</view>
	<!-- #endif -->
</template>

<script>
	import GoBack from './go-back.vue'
	import {mapState} from 'vuex'
	import {getHotIron} from '../api/api.js'
	export default {
		components: {
			GoBack
		},
		props: {
			title: {
				type: String,
				default: ''
			},
			showGif: {
				type: Boolean,
				default: false
			},
			goBack: {
				type: Boolean,
				default: false
			},
			scroll: {
				type: Boolean,
				default: false
			}
		},
		data() {
			return {
				listData: [],
				highlight: false,
				StatusBar: this.StatusBar,
				CustomBar: this.CustomBar
			}
		},
		computed:{
			...mapState({
				avatar: state => {
					if ('avatarUrl' in state.infos) {
						return state.infos.avatarUrl
					} else {
						return 'https://zzes-1251916954.cos.ap-shanghai.myqcloud.com/banner2.png'
					}
				}
			})
		},
		mounted() {
			if(this.scroll) {
				this.getIronList()
			}
		},
		methods: {
			/**
			 * 获取热门钢材
			 */
			getIronList() {
				getHotIron().then(res => {
					this.listData = res.data
					this.listData.length = 6
				})
			},
			/**
			 * 选中钢材
			 */
			checkoutIron(v) {
				this.$emit('select', v)
			}
		}
	}
</script>

<style>
.my-header {
	background: #000131;
}
.header {
	display: flex;
	align-items: center;
	min-height: 0px;
	/* #ifdef MP-WEIXIN */
	padding-right: 220upx;
	/* #endif */
	/* #ifdef MP-ALIPAY */
	padding-right: 150upx;
	/* #endif */
	box-shadow: 0upx 0upx 0upx;
	box-sizing: border-box;
	text-align: center;
	color: #fff;
	font-size: 54rpx;
	background: #000131;
	z-index: 9999;
}
.header.fixed {
	position: fixed;
	width: 100%;
	top: 0;
	z-index: 1024;
	box-shadow: 0 1upx 6upx rgba(0, 0, 0, 0.1);
}
.header .header-title {
	display: inline-block;
	font-size: 28upx;
}
.header .tab {
	display: flex;
	align-items: center;
	padding-left: 20upx;
	text-align: left;
	background: transparent;
}
.header .tab .avatar {
	margin-right: 20upx;
	width: 50upx;
	height: 50upx;
	border-radius: 50%;
}

.scroll-view_x {
	/* #ifdef MP */
	width: 290upx;
	/* #endif */
	/* #ifndef MP */
	width: 400upx;
	/* #endif */
	margin-left: 20upx;
	font-size: 24upx;
	white-space: nowrap;
}
.scroll-view-item_x {
	display: inline-block;
	padding: 0 20upx;
	margin-right: 20upx;
	text-align: center;
	border: 1upx solid #fff;
	border-radius: 2rem;
}
.tab-item {
	display: inline-block;
	font-size: 28upx;
}
.bg-gradual-red {
	background-image: linear-gradient(45deg, #f43f3b, #ec008c);
	color: #ffffff;
}

.bg-gradual-orange {
	background-image: linear-gradient(45deg, #ff9700, #ed1c24);
	color: #ffffff;
}

.bg-gradual-green {
	background-image: linear-gradient(45deg, #39b54a, #8dc63f);
	color: #ffffff;
}

.bg-gradual-purple {
	background-image: linear-gradient(45deg, #9000ff, #5e00ff);
	color: #ffffff;
}

.bg-gradual-pink {
	background-image: linear-gradient(45deg, #ec008c, #6739b6);
	color: #ffffff;
}

.bg-gradual-blue {
	background-image: linear-gradient(45deg, #0081ff, #1cbbb4);
	color: #ffffff;
}
</style>
