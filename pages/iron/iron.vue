<template>
	<view class="container">
		<view class="page-body">
			<scroll-view class="nav-left" scroll-y :style="'height:'+height+'px'">
				<view class="nav-left-item" @click="categoryClickMain(item,index)" :key="index" :class="index==categoryActive?'active':''"
				    v-for="(item,index) in categoryList">
					{{item.name}}
				</view>
			</scroll-view>
			<scroll-view class="nav-right" scroll-y :scroll-top="scrollTop" @scroll="scroll" :style="'height:'+height+'px'" scroll-with-animation>
				<view class="content">
					<view class="iron-img">
						<image class="img-item" :src="subCategoryList.logo" />
					</view>
					
					<view class="price">最新价格:<text class="price-num">{{subCategoryList.price}}</text></view>
					<view class="info">{{subCategoryList.info}}</view>
				</view>
				<!-- <view :id="index==0?'first':''" class="nav-right-item" v-for="item in subCategoryList" :key="item">
					<image :src="item.logo" />
					<view>{{item.info}}</view>
				</view>
				<page-foot :name="name" v-if="subCategoryList.length > 1"></page-foot> -->
			</scroll-view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				categoryList: [],
				subCategoryList: [],
				height: 0,
				categoryActive: 0,
				scrollTop: 0,
				scrollHeight: 0,
			}
		},
		methods: {
			scroll(e) {
				this.scrollHeight = e.detail.scrollHeight;
			},
			categoryClickMain(categroy, index) {
				this.categoryActive = index;
				this.subCategoryList = categroy.subCategoryList;
				this.scrollTop = -this.scrollHeight * index;
			},
			getCategory() {
				this.categoryList = [
					{
						name: '螺纹钢',
						content: {
							logo:"http://placehold.it/50x50",
							price: '3980元/吨',
							info:"螺纹钢是热轧带肋钢筋的俗称。 普通热轧钢筋其牌号由HRB和牌号的屈服点最小值构成。H、R、B分别为热轧（Hotrolled）、带肋（Ribbed）、钢筋（Bars）三个词的英文首位字母。"
						}
					}
				]
				console.log(this.categoryList)
				this.subCategoryList = this.categoryList[0].content;
			}
		},
		onLoad: function () {
			this.getCategory();
			this.height = uni.getSystemInfoSync().windowHeight;
		}
	}
</script>

<style>
	.page-body {
		display: flex;
	}

	.nav {
		display: flex;
		width: 100%;
	}

	.nav-left {
		width: 30%;
		border: solid 1upx #E0E0E0;
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
		width: 70%;
	}
	
	.nav-right .iron-img {
		padding: 20upx;
	}
	
	.nav-right .iron-img .img-item {
		width: 100%;
	}
	.nav-right .price {
		font-weight: bold;
	}
	.nav-right .price-num {
		color: #007AFF;
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
	}
</style>
