<template>
	<view>
		<scroll-view scroll-x>
			<wxParse :content="content" />
		</scroll-view>
		
	</view>
</template>

<script>
	import marked from '../../components/marked'
	import wxParse from '../../components/mpvue-wxparse/src/wxParse.vue'
	export default {
		name: 'articlePage',
		components: {
			wxParse
		},
		data() {
			return {
				title: '',
				content: ''
			};
		},
		onLoad() {
			try {
				const value = uni.getStorageSync('article');
				if (value) {
					const result = JSON.parse(value)
					this.title = result.title
					this.content = marked(result.content)
				}
			} catch (e) {
				// error
			}
		},
		destroyed(){
			try {
				uni.removeStorageSync('article');
			} catch (e) {
				// error
			}
		}
	}
</script>

<style>
	@import url("../../components/mpvue-wxparse/src/wxParse.css");
</style>
