<template>
  <div class="user-container">
    <my-title title="用户管理"></my-title>
    <div class="header-filters">
      <el-form :inline="true">
        <el-form-item>
          <el-button type="primary" icon="el-icon-plus" @click="createDialog=true">新增账号</el-button>
        </el-form-item>
      </el-form>
      
    </div>
    <el-dialog title="新增账号" width="24%" :visible.sync="createDialog">
      <create-form feature="create" @cancel="createDialog = false,  refreshData()"/>
    </el-dialog>

    <div class="table">
      <el-table :data="tableData" style="width: 100%" v-loading="loading">
        <el-table-column
          prop="id"
          label="用户ID"
          width="80"
          align="center">
        </el-table-column>
        <el-table-column
          prop="username"
          label="用户名"
          min-width="100"
          align="center">
        </el-table-column>
        <el-table-column
          prop="email"
          label="电子邮箱"
          min-width="180"
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
        <el-table-column
          prop="updatedAt"
          label="更新时间"
          min-width="150"
          align="center">
          <template slot-scope="scope">
            {{scope.row.updatedAt | date}}
          </template>
        </el-table-column>
        <el-table-column
          label="状态"
          min-width="80"
          align="center">
          <template>
            启用
          </template>
        </el-table-column>
        <el-table-column 
          fixed="right"
          label="操作"
          min-width="100"
          align="center">
          <template slot-scope="scope">
            <el-button type="text" @click="openEditDialog(scope.$index, scope.row)">编辑</el-button>
            <!-- <el-button type="text" @click="disableAndEnable(scope.row, 'accepted')">启用</el-button> -->
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
    <el-dialog   title="编辑账号" width="24%" :visible.sync="editDialog" >
      <edit-form feature="edit"  :editData="editData" @cancel="editDialog = false, refreshData()"/>
    </el-dialog>
  </div>
</template>
<script>
import createForm from './createForm.vue'
import editForm from './editForm.vue'
import { debounce } from '../../utils'
import { getUser } from '@/api/user.api'
export default {
  name: 'userManage',
  components: {
    createForm,
    editForm
  },
  data() {
    return {
      loading: false,
      createDialog: false,
      editDialog: false,
      editData:{},
      query: {
        pageIndex: 1,
        pageSize: 10
      },
      total: 0,
      tableData: [],
      roleList: [],
      roleObj: {}
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
      getUser(this.queryString).then(res => {
        // console.log(res)
        this.query.pageIndex = res.pageIndex
        this.query.pageSize = res.pageSize
        this.total = res.total
        this.$set(this.$data, 'tableData', res.items)
        this.loading = false
      }).catch(e => {
        this.loading = false
      })
    },

    openEditDialog(index, row) {
      this.editData = row
      this.editDialog = true
      this.idx = index;
      const item = this.tableData[index];
      this.editData = {
        id: item.id,
        username: item.username,
        password: item.password,
        roletype: item.roletype,
        permission: item.permission,
        taskNum: item.taskNum,
        email: item.email,
        phone: item.phone,
        last_login_time: item.last_login_time,
        last_login_ip: item.last_login_ip,
        status: item.status
      }
      this.editVisible = true;
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

