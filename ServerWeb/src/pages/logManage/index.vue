<template>
  <div class="log-container">
    <my-title title="日志列表"></my-title>
    <div class="header-filters" style="visibility:hidden;">
      <!-- <el-form :inline="true">
        <el-form-item>
          <el-input  placeholder="日志名称"></el-input>
        </el-form-item>
      </el-form> -->
    </div>
    <div class="table">
      <el-table 
        :data="tableData" 
        style="width: 100%" 
        v-loading="loading">
        <el-table-column
          prop="id"
          label="ID"
          min-width="80"
          align="center">
        </el-table-column>
        <el-table-column
          prop="admin"
          label="用户名"
          min-width="200">
        </el-table-column>
        <el-table-column
          prop="ip"
          label="IP"
          min-width="100"
          align="center">
          <template slot-scope="scope">
            {{scope.row.ip | ip }}
          </template>
        </el-table-column>
        <el-table-column
          prop="location"
          label="IP归属地"
          min-width="200">
        </el-table-column>
        <el-table-column
          prop="comment"
          label="操作"
          min-width="150"
          align="center">
        </el-table-column>
        <el-table-column
          prop="time"
          label="操作时间"
          min-width="150"
          align="center">
          <template slot-scope="scope">
            {{scope.row.time | date}}
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
import { getLog } from '@/api/log.api'
export default {
  name: 'logManage',
  data() {
    return {
      loading: false,
      total: 0,
      query: {
        pageSize: 10,
        pageIndex: 1
      },
      tableData: []
    }
  },
  computed: {
    queryString: function () {
      return Object.keys(this.query).filter(key => this.query[key] !== '')
        .map(key => encodeURIComponent(key) + '=' + encodeURIComponent(this.query[key]))
        .join('&')
    }
  },
  mounted() {
    this.getDataList()
  },
  methods: {
    refreshData: debounce(
      function() {
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
    getDataList() {
      this.loading = true
      getLog(this.queryString).then(res => {
        this.total = res.total
        this.query.pageIndex = res.pageIndex
        this.query.pageSize = res.pageSize
        this.tableData = res.items
        this.loading = false
      }).catch(() => {
        this.loading = false
      });
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
<style lang="scss" scoped>
  .log-container {
    .filters {
      margin-top: 20px;
    }
    .list {
      font-size: 14px;
      line-height: 2;
      margin-top: 20px;
    }
    .el-dialog {
      min-width: 888px;
    }
  }
</style>
