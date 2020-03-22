<template>
  <div class="z-header">
    <md-icon :name="leftIcon" @click="leftClick" />
    <div class="z-header-title">{{title}}</div>
    <md-icon :name="rightIcon" @click="rightClick" />
  </div>
</template>
<script>
import { Icon } from 'mand-mobile'
export default {
  name: 'ZHeader',
  props: {
    leftIcon: {
      type: String,
      default: 'arrow-left'
    },
    rightIcon: {
      type: String,
      default: 'question'
    },
    title: {
      type: String,
      default: '标题'
    }
  },
  components: {
    [Icon.name]: Icon
  },
  methods: {
    leftClick () {
      this.$emit('leftClick')
    },
    rightClick () {
      if (this.rightIcon === 'question') {
        location.href = 'https://www.zzes1314.cn/home'
      } else {
        this.$emit('rightClick')
      }
    }
  }
}
</script>
<style lang="scss" scope>
.z-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 30px;
  -webkit-box-shadow: 0 0.267vw 1.6vw 0 rgba(44,48,54,.1);
  box-shadow: 0 0.267vw 1.6vw 0 rgba(44,48,54,.1);
  .z-header-title {
    font-size: 30px;
    font-weight: bolder;
  }
}
</style>
