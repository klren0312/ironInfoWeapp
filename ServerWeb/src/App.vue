<template>
  <div id="app">
    <router-view v-if="isRouterAlive"></router-view>
    <el-dialog
      title="更新提示"
      :visible.sync="updateDialog"
      width="30%">
      <div>
        <p>1. 添加热门钢材设置, 可以添加热门钢材, 最多六个, 可以拖动列表排序</p>
        <p>2. 添加日志列表页, 可以查看系统日志</p>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="updateDialog = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  name: 'App',
  provide() {
    return {
      reload: this.reload
    }
  },
  data() {
    return {
      isRouterAlive: true,
      updateDialog: false
    }
  },
  mounted() {
    this.checkUpdate()
  },
  methods: {
    reload() {
      this.isRouterAlive = false
      this.$nextTick(_ => {
        this.isRouterAlive = true
      })
    },
    checkUpdate() {
      let update = this.$storage.get('update')
      if(!update) {
        this.updateDialog = true
        this.$storage.set('update', true)
      }
    }
  },
  created() {
    try {
      document.body.removeChild(document.getElementById('bouncing-loader'))  
    } catch (e) {
    }
  },
  beforeMount() {
    if(!this.$store.state.user) {
      this.$router.replace({
        path: '/login',
      })
    }
  }
}
</script>

<style lang="scss">
body {
  font-family: PingFang SC, '微软雅黑',Microsoft YaHei,\\5FAE\8F6F\96C5\9ED1,Arial,sans-serif;
  margin: 0;
  overflow-x: hidden;
  line-height: 1;
  position: relative;
  min-height: 100%;
  font-size: 14px;
  background: linear-gradient(145deg,#283868,#705651);
  background-position: 50%;
  background-repeat: no-repeat;
  background-attachment: fixed;
  background-size: cover;
}
#app {
  &::before {
      content: "";
      width: 100%;
      height: 100%;
      position: fixed;
      z-index: -1;
      // background: linear-gradient(to right bottom,rgba(0,0,0,0.9),rgba(0,0,0,0)),url(./assets/bg1.jpg) no-repeat center;
      background-image: url(./assets/bg1.jpg) no-repeat center;
      opacity: 0.5;
      background-position: 50%;
      background-repeat: no-repeat;
      background-attachment: fixed;
      background-size: cover;
    }
  font-family: '微软雅黑', 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  min-height: 100vh;
  .aside-content,
  .main-content {
    min-height: calc(100vh - 60px);
  }
  .aside-content {
    overflow: hidden;
  }
  .header-content {
    height: 64px;
    padding: 0 30px 0 0;
    background: rgba(255, 255, 255, 0.14);
    -webkit-box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
    box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
    position: relative;
    color: #fff;
    .right {
      float: right;
      padding: 22px 0;
      cursor: pointer;
    }
    .el-dropdown {
      color: #fff;
    }
  }
  .el-icon-d-arrow-left,
  .el-icon-d-arrow-right {
    font-size: 20px;
    cursor: pointer;
    -webkit-transition: all 0.3s, padding 0s;
    transition: all 0.3s, padding 0s;
    padding: 22px 24px;
  }
}
.header-title {
  border-left: 4px solid #1890ff;
  padding-left: 20px;
  font-size: 14px;
  font-weight: bolder;
  color: #333;
}
.header-filters {
  margin: 20px 0 0 0;
}
.del-btn {
  color: rgb(245, 35, 35);
}
</style>