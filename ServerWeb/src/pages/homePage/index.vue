<template>
  <div class="home-page">
    <div class="card-group">
      <el-row :gutter="20">
        <el-col :span="8">
          <div class="card-item">
            <div class="card-text">
              <span class="num article-num">{{article_num}}</span>
              <span class="title">篇文章</span>
            </div>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="card-item">
            <div class="card-text">
              <span class="num iron-num">{{iron_num}}</span>
              <span class="title">种钢材</span>
            </div>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="card-item">
            <div class="card-text">
              <span class="num wuser-num">{{wuser_num}}</span>
              <span class="title">位访客</span>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
    <white-space/>
    <div class="card-group gg-card">
      <div class="card-item">
        <div class="card-header">
          小程序广告列表
        </div>
        <div class="gg-list">
          <div v-for="v in ad_list" :key="v.ad_unit_id"  class="card-text">
            <div class="title">
              {{v.ad_unit_name}}
              <span class="status">
                {{v.ad_unit_status === 'AD_UNIT_STATUS_ON' ? '开启' : '关闭'}}
              </span>
            </div>
          </div>
        </div>
        <div class="gg-details">
          <div>总收入: {{(total_price.income * 0.01).toFixed(2)}} 元</div>
        </div>
      </div>
    </div>
    <white-space/>
    <div class="card-group">
      <el-row :gutter="20" >
        <el-col :span="12" >
          <div class="card-item">
            <div class="card-header">
              昨日-访问用户年龄
            </div>
            <white-space></white-space>
            <white-space></white-space>
            <ve-pie :settings="chartSetting" :data="ageData" :legend="options.legend"></ve-pie>
          </div>
        </el-col>
        <el-col :span="12">
          <div class="card-item">
            <div class="card-header">
              昨日-访问用户性别
            </div>
            <white-space></white-space>
            <white-space></white-space>
            <ve-pie :settings="chartSetting" :data="genderData" :legend="options.legend"></ve-pie>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>
<script>
import echarts from 'echarts/lib/echarts'
import { mapState } from 'vuex'
import {getHomeSum, getWxSum} from '@/api/home.api'
export default {
  name: 'homePage',
  data() {
    return {
      article_num: 0,
      iron_num: 0,
      wuser_num: 0,
      ad_list: [],
      total_price: {},
      chartSetting: {
        roseType: 'radius',
        label: {
          color: '#fff'
        },
        itemStyle: {
          emphasis: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          },
          normal: {
            color: function(params) {
              var colorList = [
              {
                c1: '#fce5ca',
                c2: '#FF9D62'                                                                   
              }, {
                c1: '#508DFF',
                c2: '#26C5FE'
              }, {
                c1: '#63E587',
                c2: '#5FE2E4'
              }, {
                c1: '#FEC163',
                c2: '#DE4313'
              }, {
                c1: '#70F570',
                c2: '#49C628'
              }, {
                c1: '#F761A1',
                c2: '#8C1BAB'
              }]
              return new echarts.graphic.LinearGradient(1, 0, 0, 0, [{
                offset: 0,
                color: colorList[params.dataIndex].c1
              }, {
                offset: 1,
                color: colorList[params.dataIndex].c2
              }])
            }
          }
        }
      },
      options: {
        legend: {
          textStyle: {
            color: '#fff'
          }
        }
      },
      ageData: {
        columns: ['name', 'value'],
        rows: [
        ]
      },
      genderData: {
        columns: ['name', 'value'],
        rows: [
        ]
      },
    }
  },
  computed: {
    ...mapState({
      themeValue: state => state.themeValue
    })
  },
  mounted() {
    this.getSum()
    this.getUser()
    const theme = this.$storage.get('themeValue')
    if (theme) {
      if (theme === 'white') {
        this.options.legend.textStyle.color = '#333'
      }
    }
  },
  methods: {
    getSum() {
      getHomeSum().then(res => {
        this.article_num = res.article_sum
        this.iron_num = res.iron_sum
        this.wuser_num = res.wuser_sum
        this.ad_list = res.ad_list
        this.total_price = res.total_price
      })
    },
    getUser() {
      getWxSum().then(res => {
        this.ageData.rows = res.ages
        this.genderData.rows = res.genders
      })
    }
  },
  watch: {
    themeValue () {
      if (this.themeValue) {
        if (this.themeValue === 'white') {
          this.options.legend.textStyle.color = '#333'
        } else {
          this.options.legend.textStyle.color = '#fff'
        }
      }
    }
  }
}
</script>
<style lang="scss">
  .home-page {
    .card-group {
      .card-item {
        padding: 15px;
        background: rgba(0,0,0,.15);
        text-align: center;
        .card-header {
          height: 36px;
          line-height: 36px;
          font-size: 14px;
          color: #9abcee;
          border-bottom: 1px solid rgba(70,87,142,.5);
          text-align: left;
        }
        .card-text {
          padding: 10px 15px;
          .num {
            margin-right: 10px;
            font-weight: 400;
            font-size: 24px;
            &.article-num {
              color: #00bd85;
            }
            &.iron-num {
              color: #e96157;
            }
            &.wuser-num {
              color: #0085d4;
            }
          }
          .title {
            color: #9abcee;
            font-size: 18px;
          }
        }
      }
    }
    .gg-card {
      .gg-list {
        padding-top: 20px;
        position: relative;
        display: flex;
        justify-content: space-around;
        align-items: center;
      }
      .gg-details {
        padding: 10px;
        color: #9abcee;
        font-weight: bold;
        font-size: 18px;
      }
      .status {
        display: inline-block;
        width: 40px;
        height: 20px;
        line-height: 20px;
        border-radius: 2rem;
        background-image: linear-gradient(135deg, #81FBB8 10%, #28C76F 100%);
        color: #fff;
        font-size: 12px;
      }
    }
  }
</style>
