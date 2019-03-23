<template>
  <el-container>
    <el-aside style="min-height: 100vh;width:auto;background:rgba(0, 21, 41, 0.37);" class="aside-content">
      <Nav :is-collapse="isCollapse"/>
    </el-aside>
    <el-container>
      <el-header class="header-content">
        <i :class="collapse" @click="isCollapse = !isCollapse" ></i>
        <div class="right">
          <el-dropdown @command="handleCommand">
            <span class="el-dropdown-link">
              {{username}}<i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="logout">退出登录</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </el-header>
      <el-main class="main-content">
        <transition name="fade-transform" mode="out-in">
          <router-view></router-view>
        </transition>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import Nav from './Nav.vue'
export default {
  name: 'Layout',
  components: {
    Nav
  },
  created() {
    let user = this.$storage.get('admin_user')
    if(user) {
       this.username = user.username
    }
  },
  computed: {
    collapse: function() {
      return this.isCollapse ?  'el-icon-d-arrow-right' : 'el-icon-d-arrow-left'
    }
  },
  data() {
    return {
      isCollapse: false,
      username: ''
    }
  },
  methods: {
    // 用户名下拉菜单 退出登录
    handleCommand(command) {
        if(command == 'logout'){
          this.$store.commit('LOG_OUT')
          this.$router.push('/login')
        }
    }
  }
}
</script>
<style lang="scss" scoped>
</style>


