<template>
<div class="jenkins-container">
  <my-title title="jenkins控制台"></my-title>
  <vue-friendly-iframe v-loading="iframeLoading" :src="site" @load="onLoad" @document-load="onDocumentLoad"></vue-friendly-iframe>
</div>  
</template>
<script>
export default {
  name: 'jenkinsCtrl',
  data() {
    return {
      site: 'http://jenkins.zzes1314.cn',
      iframeLoading: false
    }
  },
  mounted() {
    this.iframeLoading = true
  },
  methods: {
    onLoad() {
      this.iframeLoading = false;
    },
    onDocumentLoad() {
      // this.documentLoading = false;
    }
  }
}
</script>
<style lang="scss" scoped>

</style>
