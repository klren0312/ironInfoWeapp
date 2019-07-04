<template>
  <div class="header-title">
    <span>{{title}}</span>
  </div>
</template>
<script>
export default {
  name: 'myTitle',
  props: {
    title: {
      type: String,
      default: 'title'
    }
  }
}
</script>
<style lang="scss" scoped>
.header-title {
  border-left: 4px solid #1890ff;
  padding-left: 20px;
  font-size: 14px;
  font-weight: bolder;
  color: #fff;
}
</style>
