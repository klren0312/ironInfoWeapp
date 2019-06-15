<template>
  <el-row class="tac">
    <el-col :span="24">
      <el-menu
        class="el-menu-vertical-demo"
        :default-active="onRoutes"
        :unique-opened="uniqueOpen"
        :collapse="isCollapse"
        :collapse-transition = "true"
        router
        background-color="#001529"
        text-color="hsla(0,0%,100%,.65)"
        active-text-color="#fff">
        <div class="logo">
          <div class="logo-img" >
            <el-tooltip
              v-if="isCollapse"
              effect="dark"
              placement="right"
              content="钢材网管理中心"
              :hide-after='800'>
              <img class="logo-img" src="../../assets/logo.png" alt="logo">
            </el-tooltip>
            <img v-else class="logo-img" src="../../assets/logo.png" alt="logo">
          </div>
          <h3 class="title" v-if="!isCollapse">
            钢材网管理中心
          </h3>
        </div>
        <el-menu-item v-for="(v,item) in navList" :index="v.index" :key="item">
          <i :class="v.icon"></i>
          <span slot="title">{{v.name}}</span>
        </el-menu-item>
      </el-menu>
    </el-col>
  </el-row>
</template>

<script>
import menu from '../../utils/menu.js'
export default {
  name: 'Nav',
  props: {
    isCollapse: {
      type: Boolean
    }
  },
  data() {
    return {
      uniqueOpen: true,
      navList: menu
    }
  },
  computed: {
    onRoutes(){
      return this.$route.path.replace('/', '');
    }
  }
}
</script>

<style lang="scss">
.tac {
  min-height: 100vh;
  background-color: transparent;
  .el-menu {
    border: 0;
    .logo {
      height: 122px;
      padding: 20px 0;
      background: transparent;
      transition: all 0s;
      .logo-img {
        height: 66px;
        width: 66px;
        background: rgb(26, 39, 66);
        margin: 0 auto;
        text-align: center;
      }
      .title {
        color: #fff;
        font-size: 18px;
        text-align: center;
        margin-top: 20px;
        white-space: nowrap;
        font-weight: 600;
      }
    }
    &:not(.el-menu--collapse) {
      width: 250px;
    }
    &.el-menu--collapse {
      .logo {
        height: 50px;
      }
    }
  }
}
</style>


