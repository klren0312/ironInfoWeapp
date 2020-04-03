<template>
	<view class="container">
		<my-header title="钢材总览">
			<view class="iron-num">
				<view class="num-item">
					钢材总数: {{total}} 种
				</view>
			</view>
		</my-header>
		<view class="page-body">
			<scroll-view class="nav-left" scroll-y :style="'height:'+height+'px'">
				<view class="nav-left-item" @click="categoryClickMain(item,index)" :key="index" :class="index==categoryActive?'active':''"
				    v-for="(item,index) in categoryList">
					{{item.name}}
				</view>
			</scroll-view>
			<scroll-view class="nav-right" scroll-y :scroll-top="scrollTop" @scroll="scroll" :style="'height:'+height+'px'" scroll-with-animation>
				<view class="content">
					<view class="content-header">{{subCategoryList.name}}</view>
					<view class="iron-img">
						<image class="img-item" :src="subCategoryList.logo!=='' && subCategoryList.logo!==null ? subCategoryList.logo : 'https://zzes-1251916954.cos.ap-shanghai.myqcloud.com/Ocean.jpg'" />
					</view>
					
					<view class="price">最新价格:<text class="price-num">{{subCategoryList.price}}</text></view>
					<view class="info">{{subCategoryList.info}}</view>
					<!-- #ifndef MP -->
					<view class="iron-contact">
						<view class="info-text">感觉价格不合理？ 欢迎联系我们议价</view>
						<view class="info-text">联系电话(点击即可拨打)</view>
						<view class="phone"><view @click="call('17625456779')">17625456779</view><view @click="call('13856262575')">13856262575</view></view>
					</view>
					<view class="cards">
						<image class="qrcode" src="https://s1.ax1x.com/2018/12/02/FuDQVP.jpg"></image>
						<image class="qrcode" src="https://s1.ax1x.com/2018/12/02/FuDKbt.md.jpg"></image>
					</view>
					<!-- #endif -->
				</view>
			</scroll-view>
		</view>
	</view>
</template>

<script>
	import {mapState} from 'vuex'
	import MyHeader from '../../components/my-header.vue'
	import { getAllIron } from '../../api/api.js'
	export default {
		components: {
			MyHeader
		},
		data() {
			return {
				categoryList: [],
				subCategoryList: [],
				height: 0,
				categoryActive: 0,
				scrollTop: 0,
				scrollHeight: 0,
				total: 0
			}
		},
		onShareAppMessage() {
			return {
				title: '钢材总览',
				path: '/pages/iron/iron'
			}
		},
		methods: {
			call(num) {
				uni.makePhoneCall({
					phoneNumber: num
				});
			},
			scroll(e) {
				this.scrollHeight = e.detail.scrollHeight;
			},
			categoryClickMain(categroy, index) {
				this.categoryActive = index;
				this.subCategoryList = categroy.content;
				this.scrollTop = -this.scrollHeight * index;
			},
			getCategory() {
				getAllIron().then(res => {
					this.categoryList = []
					this.total = res.data.length
					res.data.map(v => {
						this.categoryList.push({
							name: v.name,
							content: {
								name: v.name,
								logo: v.photo,
								price: `${v.new_price}元/吨`,
								info: v.intro
							}
						})
					})
					this.subCategoryList = this.categoryList[0].content;
					uni.hideLoading();
				})
			}
		},
		onLoad: function () {
			uni.showLoading({
				title: '加载中'
			})
			this.getCategory();
			// #ifndef MP
			this.height = uni.getSystemInfoSync().windowHeight
			// #endif
			// #ifdef MP
			this.height = uni.getSystemInfoSync().windowHeight - this.CustomBar
			// #endif
		}
	}
</script>

<style>
	.blank {
		height: 186upx;
	}
	.page-body {
		display: flex;
		/* margin-top: 90px; */
	}
	.iron-num {
		padding-left: 20upx;
		display: flex;
		align-items: center;
		line-height: 2;
		font-size: 24upx;
		color: #fff;
	}
	.nav {
		display: flex;
		width: 100%;
	}

	.nav-left {
		width: 30%;
		overflow-y:auto;
		/* border: solid 1upx #E0E0E0; */
	}

	.nav-left-item {
		height: 100upx;
		border-bottom: solid 1upx #E0E0E0;
		font-size: 30upx;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.nav-right {
		padding: 0 28upx 0;
		width: 70%;
		background: #fcfcfc;
	}
	.nav-right .content {
		margin-top: 20rpx;
		padding-top: 20upx;
		background: #fff;
		box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
	}
	.nav-right .content-header {
		padding-left: 20upx;
		font-size: 28upx;
	}
	.nav-right .content-header::before {
		content: '';
		float: left;
		margin-top: 15upx;
		margin-right: 20upx;
		width: 10upx;
		height: 10upx;
		border-radius: 50%;
		background: #00BFFF;
	}
	.nav-right .iron-img {
		padding: 20upx;
	}
	
	.nav-right .iron-img .img-item {
		width: 100%;
	}
	.nav-right .price {
		font-weight: bold;
		text-align: center;
	}
	.nav-right .price-num {
		color: #007AFF;
	}
	.nav-right .info {
		min-height:350rpx;
		padding-left: 20upx;
		padding-top: 20upx;
	}
	.nav-right-item {
		width: 28%;
		height: 220upx;
		float: left;
		text-align: center;
		padding: 11upx;
		font-size: 28upx;
	}

	.nav-right-item image {
		width: 100upx;
		height: 100upx;
	}

	.active {
		color: #007AFF;
		background: #fcfcfc;
		border-left: 4upx solid #00BFFF;
	}
	.iron-contact .info-text {
		font-size: 30rpx;
	}
	.iron-contact .phone {
		display: flex;
		justify-content: space-around;
	}
	.cards .qrcode {
		margin-top: 20upx;
		width: 200upx;
		height: 200upx;
	}
	
	.iron-contact .info-text {
		font-size: 30rpx;
	}
	.iron-contact .phone {
		display: flex;
		justify-content: space-around;
	}
	.cards .qrcode {
		margin-top: 20upx;
		width: 200upx;
		height: 200upx;
	}
</style>
