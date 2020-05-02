<template>
  <div class="create-article">
    <my-title title="编辑文章"></my-title>
    <div class="header-filters">
      <el-form :inline="true">
        <el-form-item>
          <el-button type="primary" @click="publish">保存</el-button>
          <el-button  @click="goback">取消</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="edit-container">
      <el-input placeholder="请输入文章标题" v-model="title"></el-input>
      <!-- <markdown-editor autoinit v-model="content" :configs="configs" ref="markdownEditor"></markdown-editor> -->
      <VmMarkdown theme="green"  
        width="100%" 
        height="600px" 
        ref="markdown"
        defaultText="# 请开始您的表演! ">
      </VmMarkdown>
    </div>
  </div>  
</template>
<script>
import VmMarkdown from 'vm-markdown'
import {getArticleById, updateArticle} from '@/api/article.api'
export default {
  name: 'createArticle',
  inject: ['reload'],
  components: {
    VmMarkdown
  },
  mounted() {
    if(this.$route.query.id) {
      this.getContent(this.$route.query.id)
    } else {
      this.$router.push({path: '/404'})
    }
  },
  data() {
    return {
      title: '',
      content: ''
    }
  },
  methods:{
    publish() {
      updateArticle(this.$route.query.id, this.title, this.$refs.markdown.markdString).then(res => {
        if(res !== false) {
          this.$message.success('更新成功')
          this.$router.push({ path: '/articleManage'})
          this.reload()
        }
      })
    },
    /**
     * 获取文章
     */
    getContent(id) {
      getArticleById(id).then(res => {
        this.title = res.items[0].title
        // this.content = res.items[0].content
        this.$refs.markdown.markdString = res.items[0].content
      })
    },
    goback() {
      this.$router.go(-1)
    }
  }
}
</script>
<style lang="scss">

  .create-article {
    .edit-container {
      background: #fff;
      .el-input__inner {
        color: #333;
      }
      .markdown-editor .editor-preview-active, .markdown-editor .editor-preview-active-side {
        color: #323232;
      }
    }
  }
</style>
