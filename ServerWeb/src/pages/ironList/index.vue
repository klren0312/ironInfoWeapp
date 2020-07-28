<template>
  <div class="script-container">
    <my-title title="钢材列表"></my-title>
    <div class="header-filters">
      <el-form :inline="true">
        <el-form-item>
          <el-input size="medium" v-model="query.name" placeholder="钢材名称" prefix-icon="el-icon-search"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-plus" @click="createDialog=true">钢材录入</el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-dialog title="钢材录入" width="24%" :visible.sync="createDialog">
      <create-form feature="create" @cancel="createDialog = false,  refreshData()"/>
    </el-dialog>
    <div class="table">
       <el-table
        :data="ironData"
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
          prop="new_price"
          label="当前价格"
          min-width="150"
          align="center">
          <template slot-scope="scope">
            {{scope.row.new_price}} <el-button type="text" @click="watchPrice(scope.row)">查看历史价格</el-button>
          </template>
        </el-table-column>
        <el-table-column
          prop="intro"
          label="钢材简介"
          min-width="120"
          align="center"
          show-overflow-tooltip>
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
            <el-button @click="updatePrice(scope.row)"  type="text">
              更新价格
            </el-button>
            <el-button @click="change(scope.row)"  type="text">
              修改
            </el-button>
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
    <!-- 历史价格图表弹框 -->
    <el-dialog
      title="历史价格"
      :visible.sync="priceDialog">
      <ve-line 
        :data="chartData"
        resizeable
        :grid="chartGrid"
        :settings="chartSettings"
        :extend="chartOpt"
        :x-axis="chartOpt.xAxis"
        :y-axis="chartOpt.yAxis"
        :legend="chartOpt.legend"
        :data-zoom="chartOpt.dataZoom">
      </ve-line>
    </el-dialog>
    <el-dialog
      title="修改钢材信息"
      :visible.sync="changeDialog">
      <el-form ref="ironForm" label-position="right" label-width="80px"  :model="ironForm">
        <el-form-item label="名称" prop="name">
          <el-input v-model="ironForm.name"></el-input>
        </el-form-item>
        <el-form-item label="简介" prop="intro">
          <el-input  
            type="textarea"
            :autosize="{ minRows: 2, maxRows: 4}" 
            v-model="ironForm.intro">
          </el-input>
        </el-form-item>
        <el-form-item label="图片链接" prop="photo">
          <el-input v-model="ironForm.photo"></el-input>
        </el-form-item>
        <el-form-item class="btn-group">
          <el-button type="primary" @click="submitForm()">保存</el-button>
          <el-button @click="changeDialog = false">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>
<script>
import createForm from './createForm'
import { debounce } from '../../utils'
import {getIron, getPriceById, deleteIron, addNewPrice, updateIron} from '@/api/iron.api'
export default {
  name: 'ironScript',
  components: {
    createForm
  },
  data() {
    return {
      changeDialog: false,
      ironForm: {
        id: null,
        name: '',
        intro: '',
        photo: ''
      },
      loading: false,
      createDialog: false,
      priceDialog: false,
      query: {
        pageIndex: 1,
        pageSize: 10
      },
      total: 0,
      ironData: [],
      chartData: {
        columns: ['date', 'price'],
        rows: []
      },
      chartSettings: {
        area: true
      },
      chartGrid: {
        bottom: 40,
        left: 20
      },
      chartOpt: {
        legend: {
          show: true,
          left: 30,
          top: 15,
          icon: 'rect',
          itemGap: 50,
          itemWidth: 14,
          itemHeight: 12,
          textStyle: {
            color: '#000'
          },
          formatter: function(name) {
            return '价格'
          }
        },
        series: {
          smooth: false,
          symbol:'circle'
        },
        tooltip: {
          formatter: function (params) {
            // console.log(params)
            return `${params[0].data[0]}<br/>价格:${params[0].data[1]}`
          }
        },
        xAxis: {
          show: true,
          type: 'category',
          boundaryGap: false,
          axisLabel: {
            color: '#b1b1b9'
          },
          axisLine: {
            show: true,
            lineStyle: {
              color: '#756453'
            }
          }
        },
        yAxis: {
          axisLabel: {
            color: '#b1b1b9'
          },
          axisLine: {
            show: true,
            lineStyle: {
              color: '#756453'
            }
          },
          splitLine: {
            lineStyle: {
              color: ['#756453'],
              type: 'dashed'
            }
          },
          axisTick: {
            show: false
          }
        },
        dataZoom: [{
          type: 'slider',
          start: 0,
          end: 100,
          borderColor: '#b1b1b9',
          dataBackground: {
            lineStyle: {
              color: "#fff"
            },
            sizeStyle: {
              opacity: 0.6
            }
          }
        }]
      }
    }
  },
  mounted() {
    this.getDataList()
  },
  computed: {
    queryString: function () {
      return Object.keys(this.query).filter(key => this.query[key] !== '')
        .map(key => encodeURIComponent(key) + '=' + encodeURIComponent(this.query[key]))
        .join('&')
    }
  },
  methods: {
    change(row) {
      this.ironForm = {
        id: row.id,
        name: row.name,
        intro: row.intro,
        photo: row.photo
      }
      this.changeDialog = true
    },
    submitForm() {
      updateIron(this.ironForm).then(res => {
        this.$message.success('更新成功')
        this.refreshData()
        this.changeDialog = false
      })
    },
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
    getDataList() {
      this.loading = true
      getIron(this.queryString).then(res => {
        this.query.pageIndex = res.pageIndex
        this.query.pageSize = res.pageSize
        this.total = res.total
        this.ironData = res.items
        this.loading = false
      })
    },
    updatePrice(row) {
      this.$prompt('请输入最新价格', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          inputPattern: /^\+?[1-9][0-9]*$/ ,
          inputErrorMessage: '价格格式不正确!'
        }).then(({ value }) => {
          addNewPrice(row.id, parseFloat(value)).then(res => {
            this.$message.success(res)
            this.refreshData()
          })
        }).catch(() => {     
        });
    },
    watchPrice(row) {
      getPriceById(row.id).then(res => {
        if (res) {
          let arr = res.map(v => {
            return {
              price: v.price,
              date: new Date(v.createdAt).toLocaleDateString()
            }
          })
          // console.log(arr)
          this.chartData.rows = arr
          this.priceDialog = true
        }
      })
    },
    /**
     * 删除钢材
     */
    deleteIron(row) {
      this.$confirm('你特么这么就把钢材删了? 你赔得起吗?', '给我注意点😡', {
        confirmButtonText: '垃圾, 就删',
        cancelButtonText: '怂, 行吗, 怂',
        type: 'warning'
      }).then(() => {
        deleteIron(row.id).then(res => {
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
    }
  },
  watch: {
    query: {
      handler: function () {
        this.refreshData()
      },
      deep: true
    },
    search: {
      handler: function() {
        if(/^[0-9]*$/.test(this.search)) {
          this.query.id = this.search
          this.query.script_name = ''
        } else {
          this.query.script_name = this.search
          this.query.id = ''
        }
        this.refreshData()
      }
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
