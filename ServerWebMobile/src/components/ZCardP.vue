<template>
  <div class="the-card">
    <div
      class="card-main"
      :style="{transform: current === 0 ? `translateX(0)` : slidePx}"
      @click="handleClick"
      @touchstart="touchStart"
      @touchend="touchEnd">
      <div class="card-header" v-if="useHeader">
        <slot name="header"></slot>
      </div>
      <div class="card-content">
        <slot name="title"></slot>
        <div v-if="hasArrow" class="text-grey cuIcon-right"></div>
      </div>
      <div class="card-footer" v-if="!useCtrl">
        <slot name="footer"></slot>
        <!-- <div class="footer-item">
          <div class="app-data-icon icon-task"></div>
          <div class="text">任务数: </div>
        </div>
        <div class="footer-item">
          <div class="app-data-icon icon-data"></div>
          <div class="text">数据量:  </div>
        </div>
        <div class="footer-item">
          <div class="app-data-icon icon-size"></div>
          <div class="text">数据大小:  </div>
        </div> -->
      </div>
      <div class="card-ctrl-footer" v-else>
        <slot name="ctrlFooter"></slot>
      </div>
    </div>
    <div class="right-btns" @click="handleDel">
      <div class="bg-red del-btn">删除</div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'MyCard',
  props: {
    hasArrow: {
      type: Boolean,
      default: true
    },
    useSlide: {
      type: Boolean,
      default: true
    },
    useHeader: {
      type: Boolean,
      default: true
    },
    slidePx: {
      type: String,
      default: 'translateX(-70px)'
    },
    useCtrl: {
      type: Boolean,
      default: false
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
      if (!this.useSlide) return
      this.start = e.touches[0].clientX
    },
    touchEnd (e) {
      if (!this.useSlide) return
      this.end = e.changedTouches[0].clientX
      // 向左滑, 显示删除按钮
      if (this.current === 0 && this.end - this.start < -40) {
        this.current = 1
      }
      // 向右滑, 隐藏删除按钮
      if (this.current === 1 && this.end - this.start > 40) {
        this.current = 0
      }
    },
    handleDel () {
      this.$emit('handleDel')
    },
    handleClick () {
      this.$emit('click')
    }
  }
}
</script>

<style lang="scss">
.the-card {
  position: relative;
  margin-bottom: 12px;
  .card-main {
    position: relative;
    transition: transform .3s ease;
    z-index: 1;
    background: #FFFFFF;
  }
  .right-btns {
    position: absolute;
    top: 0;
    right: 0;
    height: 100%;
    z-index: 0;
    .del-btn {
      height: 100%;
      width: 70px;
      display: flex;
      justify-content: center;
      align-items: center;
      border: 0;
      font-size: 15px;
      text-align: center;
      color: #fff;
      background: #ff5257;
    }
  }
  .card-header {
    // display: flex;
    justify-content: space-between;
    padding: 14px;
    font-size: 13px;
    color: #666666;
    border-bottom: 1px solid #EEEEEE;
  }
  .card-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px 12px;
    font-size: 14px;
    color: #333333;
  }
  .card-ctrl-footer {
    padding: 12px;
    display: flex;
    justify-content: flex-end;
    border-top: 1px solid #EEEEEE;
  }
  .card-footer {
    padding: 0 12px 20px;
    // display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
  }
}
</style>
