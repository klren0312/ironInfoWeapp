<template>
  <div class="home-page">
    <z-header title="治电科技管理中心"
      left-icon="back"
      @leftClick="logout">
    </z-header>
    <div class="dashboard">
      <div class="dashboard-item">
        <div class="number">{{articleSum}}</div>
        <div class="text">文章数</div>
      </div>
      <div class="dashboard-item">
        <div class="number">{{ironSum}}</div>
        <div class="text">钢材数</div>
      </div>
      <div class="dashboard-item">
        <div class="number">{{wuserSum}}</div>
        <div class="text">访客数</div>
      </div>
    </div>
    <div class="shop-block" @click="toShop">钢材商店</div>
    <div class="feature-container">
      <div class="feature-item" @click="$router.push('/ironPage')">
        <div class="iconfont icon-iron"></div>
        <div class="text">钢材列表</div>
      </div>
      <div class="feature-item" @click="$router.push('/hotPage')">
        <div class="iconfont icon-hot"></div>
        <div class="text">热门钢材</div>
      </div>
      <div class="feature-item" @click="$router.push('/articlePage')">
        <div class="iconfont icon-article"></div>
        <div class="text">文章列表</div>
      </div>
      <div class="feature-item" @click="$router.push('/weixinPage')">
        <div class="iconfont icon-weixin"></div>
        <div class="text">微信用户</div>
      </div>
      <div class="feature-item" @click="$router.push('/userPage')">
        <div class="iconfont icon-user"></div>
        <div class="text">管理员列表</div>
      </div>
      <div class="feature-item" @click="$router.push('/logPage')">
        <div class="iconfont icon-log"></div>
        <div class="text">日志列表</div>
      </div>
    </div>
    <a class="ad-link" target="_blank" :href="`https://sjkh.essence.com.cn/h5kh/openAccountApli.html?bank=0&sceneid=1&branch=8910&org=1&tgid=494303&pt=crm&_time=${Date.now()}#`">
      <img class="ad-img"
        src="https://s2.ax1x.com/2019/08/25/m2tMJf.png"
        alt="ad">
    </a>
  </div>
</template>

<script>
import { getHomeSum } from '@/apis/home.api'
import ZHeader from '@/components/ZHeader.vue'
export default {
  name: 'HomePage',
  components: {
    ZHeader
  },
  data () {
    return {
      articleSum: 0,
      wuserSum: 0,
      ironSum: 0
    }
  },
  mounted () {
    this.getDashboard()
  },
  methods: {
    /**
     * 获取dashboard数据
     */
    getDashboard () {
      getHomeSum().then(res => {
        this.articleSum = res.article_sum
        this.wuserSum = res.wuser_sum
        this.ironSum = res.iron_sum
      })
    },
    /**
     * 退出登录
     */
    logout () {
      this.$store.dispatch('LOG_OUT')
      this.$router.push('/login')
    },
    /**
     * 去商店
     */
    toShop () {
      this.$router.push('/shopPage')
    }
  }
}
</script>

<style lang="scss">
  .home-page {
    .ad-link {
      display: block;
    }
    .ad-img {
      margin-top: 0.8rem;
      width: 100%;
    }
    .shop-block {
      padding: 20px;
      text-align: center;
      font-size: 28px;
      border-bottom: 1px solid #ddd;
      &:active {
        background: #eee;
      }
    }
    .dashboard {
      display: flex;
      background: #2f86f6;
      .dashboard-item {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        width: 100%;
        padding: 30px 0;
        color: #fff;
        .number {
          font-size: 50px;
          font-weight: bold;
        }
        .text {
          margin-top: 20px;
          font-size: 25px;
          color: #b6ceec;
        }
      }
    }
    .feature-container {
      display: grid;
      grid-template-columns: 1fr 1fr 1fr;
      grid-template-rows: 1fr 1fr;
      align-items: center;
      height: 500px;
      .feature-item {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        width: 100%;
        height: 100%;
        border-bottom: 1px solid #ddd;
        &:active {
          background: #eee;
        }
        &:first-child {
          border-left: 0
        }
        &:not(:last-child) {
          border-right: 1px solid #ddd;
        }
        &:nth-child(3) {
          border-right: 0;
        }
        .iconfont {
          font-size: 45px;
          color: #2f86f6;
        }
        .text {
          margin-top: 20px;
          font-size: 28px;
          color: #333;
        }
      }
    }
  }
</style>
