<template>
  <el-container class="layout">
    <el-aside style="min-height: 100vh;width:auto;background:rgba(0, 21, 41, 0.37);" class="aside-content">
      <Nav :is-collapse="isCollapse" />
    </el-aside>
    <el-container>
      <el-header class="header-content">
        <i :class="collapse" @click="isCollapse = !isCollapse"></i>
        <div class="right">
          <i @click="changeTheme" class="theme-btn el-icon-orange"></i>
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
    data() {
      return {
        isCollapse: false,
        username: '',
        themeValue: 'black'
      }
    },
    created() {
      let user = this.$storage.get('admin_user')
      if (user) {
        this.username = user.username
      }
      const theme = this.$storage.get('themeValue')
      if (theme) {
        this.themeValue = theme
        this.changeTheme(this.themeValue)
      }
    },
    computed: {
      collapse: function () {
        return this.isCollapse ? 'el-icon-d-arrow-right' : 'el-icon-d-arrow-left'
      }
    },
    methods: {
      // 用户名下拉菜单 退出登录
      handleCommand(command) {
        if (command == 'logout') {
          this.$store.commit('LOG_OUT')
          this.$router.push('/login')
        }
      },
      changeTheme: function (theme) {
        if (typeof theme === 'object') {
          theme = this.themeValue === 'black' ? 'white' : 'black'
        }
        if (theme === 'black') {
          removeCss()
        } else {
          removeCss()
          const head = document.getElementsByTagName('head')[0]
          const link = document.createElement('link')
          link.href = './theme/white.css'
          link.rel = 'stylesheet'
          link.type = 'text/css'
          head.appendChild(link)
        }
        this.themeValue = theme
        this.$storage.set('themeValue', theme)
        this.$store.dispatch('SET_THEME', theme)
        function removeCss(href) {
          const links = document.getElementsByTagName('link')
          const head = document.getElementsByTagName('head')[0]
          let arr = []
          if (links && links.length > 0) {
            for (let i = 0, len = links.length; i < len; i++) {
              if (links[i].href.match('white')) {
                arr.push(links[i])
              }
            }
            for (let i = 0, len = arr.length; i < len; i++) {
              head.removeChild(arr[i])
            }
          }
        }
      }
    }
  }
</script>
<style lang="scss" scoped>
.layout {
.main-content {
    height: calc(100vh - 60px);
    box-sizing: border-box;
  }

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
      cursor: pointer;
      display: flex;
      justify-content: space-around;
      align-items: center;
      height: 100%;
      width: 106px;

      .theme-btn {
        color: #fff;
        font-size: 26px;
      }
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
</style>