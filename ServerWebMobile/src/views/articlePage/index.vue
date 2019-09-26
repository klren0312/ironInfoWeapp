<template>
  <div class="article-page">
    <z-header
      title="治电科技管理中心-文章列表"
      left-icon="arrow-left"
      @leftClick="$router.go(-1)"></z-header>
    <div class="the-list">
      <md-scroll-view
        ref="scrollView"
        :scrolling-x="false"
        @end-reached="onEndReached"
        style="height: calc(100vh - 60px)">
        <z-card
          v-for="v in articleList"
          :key="v.id"
          @click="seeArticle(v.id)">
          <div slot="left">
            <div class="z-card-title">{{v.title}}</div>
            <div class="z-card-info">{{day(v.createdAt).format('YYYY-MM-DD')}}</div>
          </div>
          <template slot="right">
            <div class="ctrl-btn-group">
              <md-switch v-model="v.status" @change="changeStatus($event, v.id)"></md-switch>
            </div>
          </template>
          <template slot="btn">
            <button class="z-card-btn del-btn"  @click="delArticle(v.id)">删除</button>
          </template>
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
import { getArticle, deleteArticle, updateArticleStatus } from '@/apis/article.api'
import { queryFormat } from 'zmethods'
import dayjs from 'dayjs'
export default {
  name: 'ArticlePage',
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
      articleList: [],
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
    this.getArticle()
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
      getArticle(this.queryString).then(res => {
        this.query.pageSize = res.pageSize
        this.query.pageIndex = res.pageIndex
        this.articleList = [ ...this.articleList, ...res.items ]
        this.$refs.scrollView.finishLoadMore()
      })
    },
    getArticle () {
      getArticle(this.queryString).then(res => {
        this.query.pageSize = res.pageSize
        this.query.pageIndex = res.pageIndex
        this.articleList = res.items
      })
    },
    /**
     * 删除文章
     */
    delArticle (id) {
      Dialog.confirm({
        title: '删除文章',
        content: '此操作将永久删除该文章, 是否继续',
        confirmText: '继续',
        onConfirm: () => {
          deleteArticle(id).then(res => {
            if (res) {
              const index = this.articleList.findIndex(v => v.id === id)
              this.articleList.splice(index, 1)
              Toast.succeed(res.message)
            }
          })
        }
      })
    },
    /**
     * 禁用启用文章
     */
    changeStatus (v, id) {
      updateArticleStatus(id, status).then(res => {
        if (res) {
          Toast.succeed(res.message)
        }
      })
    },
    /**
     * 查看文章
     */
    seeArticle (id) {
      this.$router.push(`/articlePage/${id}`)
    }
  }
}
</script>
<style lang="scss" scope>
.article-page {
  .article-list {
    padding: 20px;
    background: rgb(249, 250, 251);
  }
}
</style>
