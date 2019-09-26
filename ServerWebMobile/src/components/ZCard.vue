<template>
<div class="z-card" @click="clickItem">
  <div
    class="z-card-content"
    :style="{left: current === 0 ? `0px` : `-19%`}"
    @touchstart="touchStart"
    @touchend="touchEnd">
    <div class="left-content">
      <div class="z-card-img-block" v-if="useImg">
        <slot name="image"></slot>
      </div>
      <div class="z-card-text">
        <slot name="left"></slot>
      </div>
    </div>
    <slot name="right"></slot>
  </div>
  <div class="z-card-btn-group" v-if="useSlide">
    <slot name="btn"></slot>
    <!-- <button class="z-card-btn del-btn">删除</button> -->
  </div>
</div>
</template>
<script>
export default {
  name: 'ZCard',
  props: {
    useImg: {
      type: Boolean,
      default: false
    },
    useSlide: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      current: 0,
      start: 0,
      end: 0
    }
  },
  methods: {
    touchStart (e) {
      this.start = e.touches[0].clientX
    },
    touchEnd (e) {
      this.end = e.changedTouches[0].clientX
      // console.log(this.start, this.end, this.current)
      // console.log(this.current === 0 && this.end - this.start < -30, this.current === 1 && this.end - this.start > 30)
      // 向左滑, 显示删除按钮
      if (this.current === 0 && this.end - this.start < -40) {
        this.current = 1
      }
      // 向右滑, 隐藏删除按钮
      if (this.current === 1 && this.end - this.start > 40) {
        this.current = 0
      }
    },
    clickItem () {
      this.$emit('click')
    }
  }
}
</script>
<style lang="scss">
.z-card {
  position: relative;
  height: 166px;
  margin-bottom: 40px;
  overflow: hidden;
  box-sizing: border-box;
  background: #fff;
  .left-content {
    display: flex;
    align-items: center;
  }
  .z-card-img-block {
    width: 100px;
    height: 100px;
    .z-card-img {
      width: 100%;
      height: 100%;
    }
  }
  .z-card-text {
    padding-left: 20px;
  }
  .z-card-content {
    display: flex;
    align-items: center;
    justify-content: space-between;
    position: absolute;
    left: 0;
    width: 100%;
    height: 100%;
    padding: .36rem 20px;
    line-height: 50px;
    z-index: 1;
    box-sizing: border-box;
    background: #fff;
    transition: all .5s ease;
    .z-card-title {
      width: 450px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      line-height: 1.2;
      color: #111a34;
      font-size: 0.32rem;
    }
    .z-card-info {
      color: #858b9c;
      font-size: 0.24rem;
      line-height: 1.4;
      margin-top: 0.08rem;
    }
  }
  .z-card-btn-group {
    position: absolute;
    right: 0;
    height: 100%;
    z-index: 0;
  }
  .z-card-btn {
    height: 100%;
    width: 140px;
    border: 0;
    font-size: 30px;
    color: #fff;
    background: #ff5257;
    &:active {
      background: #ff474d;
    }
  }
}
</style>
