<template>
  <div class="script-container">
    <my-title title="热门钢材列表(拖动列表排序, 最多六个)"></my-title>
    <div class="header-filters">
      <el-form :inline="true">
        <el-form-item>
          <el-button type="primary" icon="el-icon-plus" @click="total < 6 ? createDialog=true : createDialog=false" :disabled="total>=6">热门钢材录入</el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-dialog title="热门钢材录入" width="24%" :visible.sync="createDialog">
      <create-form feature="create" @cancel="createDialog = false,  refreshData()"/>
    </el-dialog>
    <div class="table">
       <el-table
        :data="hotData"
        row-key="id"
        style="width: 100%"
        v-loading="loading">
        <el-table-column
          prop="id"
          label="钢材ID"
          align="center"
          min-width="65">
        </el-table-column>
        <el-table-column
          prop="name"
          label="钢材名称"
          min-width="100"
          align="center">
        </el-table-column>
        <el-table-column
          prop="updatedAt"
          label="更新时间"
          min-width="200"
          align="center">
          <template slot-scope="scope">
            {{scope.row.updatedAt | date}}
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          fixed="right"
          width="280"
          align="center">
          <template slot-scope="scope">
            <el-button class="del-btn" @click="deleteIron(scope.row)"  type="text">
              删除
            </el-button>
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
import createForm from './createForm'
import { debounce, throttle } from '../../utils'
import Sortable from 'sortablejs'
import {getHot, deleteHot, updateSort} from '@/api/hot.api'

export default {
  name: 'ironScript',
  components: {
    createForm
  },
  data() {
    return {
      changeDialog: false,
      ironForm: {
        id: '',
        name: '',
        ironId: '',
        icon: ''
      },
      loading: false,
      createDialog: false,
      query: {
        pageIndex: 1,
        pageSize: 10
      },
      total: 0,
      hotData: [],
      ironList: [],
      select: ''
    }
  },
  mounted() {
    this.getHotData()
    this.$nextTick(_ => {
      this.setSort()
    })
  },
  computed: {
    queryString: function () {
      return Object.keys(this.query).filter(key => this.query[key] !== '')
        .map(key => encodeURIComponent(key) + '=' + encodeURIComponent(this.query[key]))
        .join('&')
    }
  },
  methods: {
    /**
     * 获取所有钢材下拉列表
     */
    getList: function() {
      this.$http.get('/iron/all').then(res => {
        this.ironList = res
      }).catch(e => {})
    },
    /**
     * sortable配置
     */
    setSort() {
      const el = document.querySelectorAll('.el-table__body-wrapper > table > tbody')[0]
      this.sortable = Sortable.create(el, {
        ghostClass: 'sortable-ghost',
        setData: function(dataTransfer) {
          dataTransfer.setData('Text', '')
        },
        onEnd: evt => {
          // console.log(evt)
          const targetRow = this.hotData.splice(evt.oldIndex, 1)[0]
          this.hotData.splice(evt.newIndex, 0, targetRow)
        }
      })
    },
    refreshData: debounce(
      function () {
        this.getHotData()
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
    /**
     * 热门钢材
     */
    getHotData() {
      this.loading = true
      getHot().then(res => {
        this.hotData = res
        this.total= res.length
        this.$nextTick(_ => {
          this.setSort()
          this.loading = false
        })
      })
    },
    /**
     * 删除钢材
     */
    deleteIron(row) {
      this.$confirm('你特么把热门钢材删了? 用户跑了你赔得起吗?', '给我注意点😡', {
        confirmButtonText: '垃圾, 就删',
        cancelButtonText: '怂, 行吗, 怂',
        type: 'warning'
      }).then(() => {
        deleteHot(row.id).then(res => {
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
          this.refreshData()
        }) 
      }).catch(() => {   
        this.$message({
          type: 'info',
          message: '怂不怂? 垃圾?'
        });    
      });
    },
    /**
     * 保存排序
     */
    saveSort: throttle(function() {
      updateSort(this.hotData).then(res => {})
    }, 2000)
  },
  watch: {
    query: {
      handler: function () {
        this.refreshData()
      },
      deep: true
    },
    hotData: {
      handler: function () {
        this.hotData.forEach((v, i) => v.sort = i)
        this.saveSort()
      }
    },
    select: function() {
      let obj = this.select ? JSON.parse(this.select) : {}
      this.ironForm.ironId = obj.id
      this.ironForm.name = obj.name
    }
  }
}
</script>
<style lang="scss">
.script-container {
  .el-dialog {
    min-width: 474px;
  }
}
</style>
