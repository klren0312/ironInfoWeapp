<template>
  <div class="user-page">
    <z-header
      title="治电科技管理中心-管理员列表"
      left-icon="arrow-left"
      @leftClick="$router.go(-1)"></z-header>
    <div class="the-list">
      <md-scroll-view
        ref="scrollView"
        :scrolling-x="false"
        @end-reached="onEndReached"
        style="height: calc(100vh - 60px)">
        <z-card
          v-for="v in userList"
          :key="v.id">
          <div slot="left">
            <div class="z-card-title">{{v.username}}</div>
            <div class="z-card-info">权限: {{v.role}}</div>
            <div class="z-card-info">{{day(v.createdAt).format('YYYY-MM-DD')}}</div>
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
import { Button, Dialog, Toast, ScrollView, ScrollViewMore, Switch } from 'mand-mobile'
import ZHeader from '@/components/ZHeader.vue'
import ZCard from '@/components/ZCard.vue'
import { getUser } from '@/apis/user.api'
import { queryFormat } from 'zmethods'
import dayjs from 'dayjs'
export default {
  name: 'UserPage',
  components: {
    [Button.name]: Button,
    [Dialog.name]: Dialog,
    [Toast.name]: Toast,
    [Switch.name]: Switch,
    [ScrollView.name]: ScrollView,
    [ScrollViewMore.name]: ScrollViewMore,
    ZHeader,
    ZCard
  },
  data () {
    return {
      userList: [],
      isFinished: false,
      total: 0,
      query: {
        pageIndex: 1,
        pageSize: 10
      },
      day: dayjs
    }
  },
  computed: {
    queryString () {
      return queryFormat(this.query)
    }
  },
  mounted () {
    this.getUser()
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
      getUser(this.queryString).then(res => {
        this.query.pageSize = res.pageSize
        this.query.pageIndex = res.pageIndex
        this.userList = [ ...this.userList, ...res.items ]
        this.$refs.scrollView.finishLoadMore()
      })
    },
    getUser () {
      getUser(this.queryString).then(res => {
        this.query.pageSize = res.pageSize
        this.query.pageIndex = res.pageIndex
        this.userList = res.items
      })
    }
  }
}
</script>
<style lang="scss" scope>
.user-page {
}
</style>
