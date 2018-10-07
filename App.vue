<script>
	export default {
		onLaunch: function () {
			console.log('App Launch')
		},
		onShow: function () {
			console.log('App Show')
		},
		onHide: function () {
			console.log('App Hide')
		}
	}
</script>

<style>
	@import 'common/uni.css';
	/*每个页面公共css */
	page {
		min-height: 100%;
		display: flex;
		flex-direction: column;
		/* justify-content: center; */
	}
</style>
