<template>
  <div class="article-container">
    <my-title title="文章管理"></my-title>
    <div class="header-filters">
      <el-form :inline="true">
        <el-form-item>
          <el-select v-model="query.status" size="medium">
            <el-option label="全部" value=""></el-option>
            <el-option label="启用" :value="true"></el-option>
            <el-option label="禁用" :value="false"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-plus" @click="toCreate">新建文章</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="table">
      <el-table
        :data="tableData"
        style="width: 100%"
        v-loading="loading">
        <el-table-column
          prop="createdAt"
          label="发布日期"
          align="center"
          min-width="180">
          <template slot-scope="scope">
            {{scope.row.createdAt | date}}
          </template>
        </el-table-column>
        <el-table-column
          prop="title"
          label="文章标题"
          align="center"
          min-width="200">
        </el-table-column>
        <el-table-column
          prop="status"
          label="状态"
          align="center"
          min-width="200">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.status" @change="changeStatus(scope.row)" :active-value="true" :inactive-value="false"></el-switch>
          </template>
        </el-table-column>
        <el-table-column 
          fixed="right"
          label="操作"
          min-width="150"
          align="center">
          <template slot-scope="scope">
            <el-button type="text" @click="editArticle(scope.row)">编辑/查看</el-button>
            <el-button class="del-btn" type="text" @click="deleteArticle(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        v-if='total > 0'
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="query.pageIndex"
        :page-sizes="[10, 20, 30]"
        :page-size="query.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </div>
  </div>
</template>
<script>
import { debounce } from '@/utils'
import {getArticle, deleteArticle, updateArticleStatus} from '@/api/article.api'
export default {
  name: 'articleManage',
  data () {
    return {
      tableData:[],
      total: 0,
      query: {
        pageSize: 10,
        pageIndex: 1,
        status: ''
      },
      loading: false
    }
  },
  computed: {
    queryString: function () {
      return Object.keys(this.query)
      .filter(key => this.query[key] !== '')
        .map(key => encodeURIComponent(key) + '=' + encodeURIComponent(this.query[key]))
        .join('&')
    }
  },
  created: function () {
    this.getArticle()
  },
  methods: {
    refreshData: debounce(
      function() {
        this.getArticle()
      },
      800
    ),
    getArticle() {
      this.loading = true
      getArticle(this.queryString).then(res => {
        if(res !== false) {
          this.tableData = res.items
          this.total = res.total
          this.query.pageIndex = res.pageIndex
          this.query.pageSize = res.pageSize
        }
        this.loading = false
      })
    },
    deleteArticle(row) {
      this.$confirm('操特么, 你删个试试?🏹', '🤨', {
        confirmButtonText: '我特么就删了',
        cancelButtonText: '我错了, 不行吗😥?',
        type: 'warning'
      }).then(() => {
        deleteArticle(row.id).then(res => {
          if(res !== false) {
            this.$message.success('删除成功!')
            this.refreshData()
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '怂不怂? 垃圾?'
        });          
      });
    },
    toCreate() {
      this.$router.push({ path: '/tlgc/createArticle'})
    },
    editArticle(row) {
      this.$router.push({ path: '/tlgc/editArticle', query: {
        id: row.id
      }})
    },
    handleSizeChange(val) {
      if (this.loading) {
        return false
      }
      this.query.pageIndex = 1
      this.query.pageSize = val
    },
    handleCurrentChange(val) {
      if (this.loading) {
        return false
      }
      this.query.pageIndex = val
    },
    changeStatus(row) {
      updateArticleStatus(row.id, row.status).then(res => {
        if (res !== false) {
          this.$message.success('状态修改成功')
        }
        this.refreshData()
      })
    }
  },
  watch:{
    query: {
      handler: function() {
        this.refreshData()
      },
      deep: true
    }
  }
}
</script>

<style lang="scss">
</style>
