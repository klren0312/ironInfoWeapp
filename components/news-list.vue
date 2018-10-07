<template>
	<view class="uni-list">
		<view class="uni-list-cell" hover-class="uni-list-cell-hover" v-for="(value,key) in newsArr" :key="key">
			<view class="uni-media-list">
				<view class="uni-media-list-logo">
					<image v-if="showImg" :src="value.img"></image>
				</view>
				<view class="uni-media-list-body">
					<view class="uni-media-list-text-top">{{value.title}}</view>
					<view class="uni-media-list-text-bottom uni-ellipsis">{{value.content}}</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		name:'news-list',
		props: {
			newsArr: {
				type: Array
			}
		},
		data() {
			return {
				showImg: false
			}
		},
		onLoad: function(){
			setTimeout(() => {
				this.showImg = true;
			}, 400)
		}
	}
</script>

<style>
	.page {
		background: #efeff4;
	}

	.title {
		padding: 20upx;
	}
</style>
