<template>
	<view class="header">
		<view class="tab">
			<go-back v-if="goBack"></go-back>
			<image class="avatar" :src="avatar"></image>
			<view class="header-title">
				{{title}}
			</view>
		</view>
		<image v-if="showGif" src="https://zzes-1251916954.cos.ap-shanghai.myqcloud.com/wave.gif" class="wave-gif" mode=""></image>
	</view>
</template>

<script>
	import GoBack from './go-back.vue'
	import {mapState} from 'vuex'
	export default {
		components: {
			GoBack
		},
		props: {
			title: {
				type: 'String'
			},
			showGif: {
				type: 'Boolean',
				default: true
			},
			goBack: {
				type: 'Boolean',
				default: false
			},
			scroll: {
				type: 'Boolean',
				default: false
			}
		},
		computed:mapState({
			avatar: state => state.infos.avatarUrl
		}),
	}
</script>

<style>
.tab-item {
	display: inline-block;
	font-size: 28upx;
}
.header {
	padding-top: 70upx;
	box-sizing: border-box;
	height: 78px;
	background: #376956;
	position: fixed;
	width: 100%;
	top: 0;
	z-index: 1024;
	text-align: center;
	color: #fff;
	font-size: 54rpx;
}
.header .header-title {
	display: inline-block;
	font-size: 28upx;
}
.header .tab {
	display: flex;
	align-items: center;
	padding-left: 20upx;
	height: 30px;
	text-align: left;
	background: transparent;
}
.header .tab .avatar {
	margin-right: 20upx;
	width: 50upx;
	height: 50upx;
	border-radius: 50%;
}
</style>
