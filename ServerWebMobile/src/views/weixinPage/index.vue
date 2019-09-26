<template>
  <div class="iron-page">
    <z-header
      title="治电科技管理中心-微信用户列表"
      left-icon="arrow-left"
      @leftClick="$router.go(-1)"></z-header>
    <div class="iron-list">
      <md-scroll-view
        ref="scrollView"
        :scrolling-x="false"
        @end-reached="onEndReached"
        style="height: calc(100vh - 60px)">
        <z-card
          :useImg="true"
          v-for="v in wuserList"
          :useSlide="false"
          :key="v.id">
          <img class="z-card-img" v-if="v.avatarUrl" :src="v.avatarUrl" alt="钢材图片" slot="image">
          <div slot="left">
            <div class="z-card-title">{{v.nickName}}</div>
            <div class="z-card-info">{{v.country}} {{v.province}} {{v.city}}</div>
          </div>
          <div slot="right">
            <div class="z-card-info">访问次数: {{v.count}}</div>
          </div>
        </z-card>
        <md-scroll-view-more
          slot="more"
          :is-finished="isFinished"
        >
        </md-scroll-view-more>
      </md-scroll-view>
    </div>
  </div>
</template>
<script>
import { Button, ScrollView, ScrollViewMore } from 'mand-mobile'
import ZHeader from '@/components/ZHeader.vue'
import ZCard from '@/components/ZCard.vue'
import { getWuser } from '@/apis/wuser.api'
import { queryFormat } from 'zmethods'
export default {
  name: 'IronPage',
  components: {
    [Button.name]: Button,
    [ScrollView.name]: ScrollView,
    [ScrollViewMore.name]: ScrollViewMore,
    ZHeader,
    ZCard
  },
  data () {
    return {
      wuserList: [],
      isFinished: false,
      total: 0,
      query: {
        pageIndex: 1,
        pageSize: 10,
        pageField: 'id'
      }
    }
  },
  computed: {
    queryString () {
      return queryFormat(this.query)
    }
  },
  mounted () {
    this.getWuser()
  },
  methods: {
    /**
     * 到底加载
     */
    onEndReached () {
      if (this.isFinished) {
        return
      }
      ++this.query.pageIndex
      getWuser(this.queryString).then(res => {
        this.query.pageSize = res.pageSize
        this.query.pageIndex = res.pageIndex
        this.wuserList = [ ...this.wuserList, ...res.items ]
        this.$refs.scrollView.finishLoadMore()
      })
    },
    getWuser () {
      getWuser(this.queryString).then(res => {
        this.query.pageSize = res.pageSize
        this.query.pageIndex = res.pageIndex
        this.wuserList = res.items
      })
    }
  }
}
</script>
<style lang="scss" scope>
.wuser-page {
  .wuser-list {
    padding: 20px;
    background: rgb(249, 250, 251);
  }
}
</style>
