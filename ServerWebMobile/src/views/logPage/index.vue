<template>
  <div class="log-page">
    <z-header
      title="治电科技管理中心-日志列表"
      left-icon="arrow-left"
      @leftClick="$router.go(-1)"></z-header>
    <div class="the-list">
      <md-scroll-view
        ref="scrollView"
        :scrolling-x="false"
        @end-reached="onEndReached"
        style="height: calc(100vh - 60px)">
        <z-card
          v-for="v in logList"
          :key="v.id"
          :useSlide="false">
          <div slot="left">
            <div class="z-card-title">{{v.comment}}</div>
            <div class="z-card-info">{{v.admin}}&nbsp;&nbsp;{{day(v.time).format('YYYY-MM-DD')}}</div>
            <div class="z-card-info">{{v.location | locationFilter}}</div>
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
import { Button, Toast, ScrollView, ScrollViewMore, Switch } from 'mand-mobile'
import ZHeader from '@/components/ZHeader.vue'
import ZCard from '@/components/ZCard.vue'
import dayjs from 'dayjs'
import { getLog } from '@/apis/log.api'
import { queryFormat } from 'zmethods'
export default {
  name: 'LogPage',
  components: {
    [Button.name]: Button,
    [Toast.name]: Toast,
    [Switch.name]: Switch,
    [ScrollView.name]: ScrollView,
    [ScrollViewMore.name]: ScrollViewMore,
    ZHeader,
    ZCard
  },
  data () {
    return {
      day: dayjs,
      logList: [],
      isFinished: false,
      total: 0,
      query: {
        pageIndex: 1,
        pageSize: 10
      }
    }
  },
  computed: {
    queryString () {
      return queryFormat(this.query)
    }
  },
  mounted () {
    this.getLogs()
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
      getLog(this.queryString).then(res => {
        this.query.pageSize = res.pageSize
        this.query.pageIndex = res.pageIndex
        this.logList = [ ...this.logList, ...res.items ]
        this.$refs.scrollView.finishLoadMore()
      })
    },
    getLogs () {
      getLog(this.queryString).then(res => {
        this.query.pageSize = res.pageSize
        this.query.pageIndex = res.pageIndex
        this.logList = res.items
      })
    }
  },
  filters: {
    locationFilter: function (v) {
      if (v) {
        const arr = v.split('|')
        return `${arr[0]}-${arr[1]}-${arr[2]}`
      } else {
        return v
      }
    }
  }
}
</script>
<style lang="scss" scope>

</style>
