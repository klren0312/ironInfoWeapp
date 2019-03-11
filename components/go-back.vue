<template>
	<view>
		<navigator class="go-back" open-type="navigateBack" delta="1" hover-class="none">
			
			<text class="iconfont">&#xe63e;</text>
		</navigator>
	</view>
</template>

<script>
	export default {
		name: 'goBack',
		data() {
			return {

			};
		}
	}
</script>

<style>
.go-back {
	display: flex;
	align-items: center;
	justify-content: center;
	position: relative;
	width: 50upx;
	height: 50upx;
	border-radius: 50%;
	border: 1px solid #fff;
	margin-right: 40upx;
}
.go-back .iconfont {
	font-size:33upx;
}
</style>