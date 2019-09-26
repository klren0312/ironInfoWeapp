<template>
  <div class="article-page">
    <z-header
      title="治电科技管理中心-文章详情"
      left-icon="arrow-left"
      @leftClick="$router.go(-1)"></z-header>
      <div class="details" v-html="details"></div>
  </div>
</template>
<script>
import ZHeader from '@/components/ZHeader.vue'
import { getArticleById } from '@/apis/article.api'
import marked from 'marked'
export default {
  name: 'ArticlePage',
  components: {
    ZHeader
  },
  data () {
    return {
      details: ''
    }
  },
  mounted () {
    console.log(this.$route)
    if (this.$route.params && this.$route.params.hasOwnProperty('id')) {
      this.getDetails(this.$route.params.id)
    }
  },
  methods: {
    getDetails (id) {
      getArticleById(id).then(res => {
        if (res) {
          this.details = marked(res.items[0].content)
        }
      })
    }
  }
}
</script>
<style lang="scss" scope>
.article-page {
  .details {
    padding: 20px;
    font-size: 32px;
    img {
      width: 100%;
    }
  }
}
</style>
