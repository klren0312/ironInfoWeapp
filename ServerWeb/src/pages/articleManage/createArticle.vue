<template>
  <div class="create-article">
    <my-title title="新建文章"></my-title>
    <div class="header-filters">
      <el-form :inline="true">
        <el-form-item>
          <el-button type="primary" icon="el-icon-plus" @click="publish">发布</el-button>
          <el-button  @click="goback">取消</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="edit-container">
      <el-input placeholder="请输入文章标题" v-model="title"></el-input>
      <!-- <markdown-editor :autoinit="false" v-model="content" :configs="configs" ref="markdownEditor"></markdown-editor> -->
      <VmMarkdown theme="princess"  
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
import {publishArticle} from '@/api/article.api'
export default {
  name: 'createArticle',
  inject: ['reload'],
  components: {
    VmMarkdown
  },
  data() {
    return {
      title: '',
      content: '',
    }
  },
  methods:{
 
    publish() {
      publishArticle(this.title, this.$refs.markdown.markdString).then(res => {
        if(res !== false) {
          this.$message.success('发布成功')
          this.$router.push({ path: '/articleManage'})
          this.reload()
        }
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
