<template>
	<view class="the-input">
		<input class="input" v-model="inputData" type="text" placeholder="请输入钢材名称" />
		<button class="button" :disabled="disabled" @click="search">{{buttonName}}</button>
	</view>
</template>

<script>
	export default {
		props:{
			buttonName: {
				type: String,
				default: "搜索"
			},
			disabled: {
				type: Boolean,
				default: false
			}
		},
		data() {
			return {
				name: ''
			}
		},
		methods: {
			search() {
				if(this.inputData === '') {
					uni.showModal({
						title: '提示',
						content: '搜索内容不能为空',
						showCancel: false
					})
					return 
				}
				// console.log(this.inputData)
				this.$emit('search', {
					name: this.inputData
				})
			}
		}
	}
</script>

<style>
	.the-input {
		display: flex;
		justify-content: center;
		align-items: center;
		padding-top: 65upx;
		font-size: 30upx;
	}
	.input {
		height: 86upx;
		border-radius: 2rem 0 0 2rem;
		padding-left: 52upx;
		/* background: #1d2026; */
		background: #FFFFFF;
		color: #323232;
		border: 1upx solid #383741;
		border-right: 0;
		font-size: 30upx;
		box-sizing: border-box;
		width: 4rem;
	}
	.button {
		font-size: 30upx;
		border-radius: 0 2rem 2rem 0;
		margin: 0;
		background-color: #3495e7;
		color: #FFFFFF;
		border: 0;
		height: 86upx;
		line-height: 86upx;
		width: 2rem;
	}
	button[disabled]:not([type]) {
		background-color: #3495e7;
	}
</style>
