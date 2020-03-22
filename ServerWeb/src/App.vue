<template>
  <div id="app">
    <router-view v-if="isRouterAlive"></router-view>
    <el-dialog
      title="更新提示"
      :visible.sync="updateDialog"
      width="30%">
      <div>
        <p>1. 添加服务器选择</p>
        <p>2. 添加钢材商城</p>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="updateDialog = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { mapActions } from 'vuex'

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
  font-family: '微软雅黑', 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  min-height: 100vh;
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