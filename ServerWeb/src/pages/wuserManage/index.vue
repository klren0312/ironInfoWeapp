<template>
  <div class="user-container">
    <my-title title="用户管理"></my-title>
    <div class="header-filters">
      <el-form :inline="true">
        <el-form-item>
          <el-input size="medium" placeholder="请输入昵称" v-model="query.nickName"></el-input>
        </el-form-item>
        <el-form-item>
          <el-select size="medium" v-model="query.pageField" placeholder="请选择排序方式">
            <el-option label="按id" value="id"></el-option>
            <el-option label="按访问次数" value="count"></el-option>
          </el-select>
        </el-form-item>
      </el-form> 
    </div>
    <div class="table">
      <el-table :data="tableData" style="width: 100%" v-loading="loading">
        <el-table-column
          prop="openId"
          label="openId"
          width="80"
          align="center">
        </el-table-column>
        <el-table-column
          prop="nickName"
          label="昵称"
          width="80"
          align="center">
        </el-table-column>
        <el-table-column
          prop="gender"
          label="性别"
          width="80"
          align="center">
          <template slot-scope="scope">
            {{scope.row.gender | sex}}
          </template>
        </el-table-column>
        <el-table-column
          prop="avatarUrl"
          label="头像"
          min-width="100"
          align="center">
          <template slot-scope="scope">
            <img :src="scope.row.avatarUrl" alt="头像" >
          </template>
        </el-table-column>
        <el-table-column
          prop="city"
          label="所在地"
          min-width="180"
          align="center">
          <template slot-scope="scope">
            {{scope.row.country}} {{scope.row.province}} {{scope.row.city}}
          </template>
        </el-table-column>
        <el-table-column
          prop="count"
          label="访问次数"
          min-width="90"
          align="center">
        </el-table-column>
        <el-table-column
          prop="createdAt"
          label="创建时间"
          min-width="150"
          align="center">
          <template slot-scope="scope">
            {{scope.row.createdAt | date}}
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
import { debounce } from '../../utils'
import { getWuser } from '@/api/wuser.api'
export default {
  name: 'wuserManage',
  data() {
    return {
      loading: false,
      query: {
        pageIndex: 1,
        pageSize: 10,
        nikeName: '',
        pageField: 'id'
      },
      total: 0,
      tableData: []
    }
  },
  filters: {
    sex: function (v) {
      const obj = {
        0: '女',
        1: '男',
        2: '未知'
      }
      return obj[v]
    }
  },
  created() {
    this.getDataList()
  },
  computed: {
    queryString: function () {
      return Object.keys(this.query)
      .filter(key => this.query[key] !== '')
        .map(key => encodeURIComponent(key) + '=' + encodeURIComponent(this.query[key]))
        .join('&')
    }
  },
  methods: {
    refreshData: debounce(
      function () {
        this.getDataList()
      },
      800
    ),
    handleSizeChange(val) {
      if (this.loading) {
        return false
      }
      this.query.pageSize = val
    },
    handleCurrentChange(val) {
      if (this.loading) {
        return false
      }
      this.query.pageIndex = val
    },
    async getDataList() {
      this.loading = true
      // 表格渲染
      getWuser(this.queryString).then(res => {
        // console.log(res)
        this.query.pageIndex = res.pageIndex
        this.query.pageSize = res.pageSize
        this.total = res.total
        this.$set(this.$data, 'tableData', res.items)
        this.loading = false
      }).catch(e => {
        this.loading = false
      })
    }
  },
  watch: {
    query: {
      handler: function () {
        this.refreshData()
      },
      deep: true
    }
  }
}
</script>
<style lang="scss">
.user-container {
  .el-dialog {
    min-width: 560px;
  }
}
</style>

