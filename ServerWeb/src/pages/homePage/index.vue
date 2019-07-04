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
    <white-space></white-space>
    <div class="card-group">
      <el-row :gutter="20" >
        <el-col :span="12" >
          <div class="card-item">
            <div class="card-header">
              昨日-访问用户年龄
            </div>
            <white-space></white-space>
            <white-space></white-space>
            <ve-pie :data="ageData" :legend="options.legend"></ve-pie>
          </div>
        </el-col>
        <el-col :span="12">
          <div class="card-item">
            <div class="card-header">
              昨日-访问用户性别
            </div>
            <white-space></white-space>
            <white-space></white-space>
            <ve-pie :data="genderData" :legend="options.legend"></ve-pie>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>
<script>
import {getHomeSum, getWxSum} from '@/api/home.api'
export default {
  name: 'homePage',
  data() {
    return {
      article_num: 0,
      iron_num: 0,
      wuser_num: 0,
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
  mounted() {
    this.getSum()
    this.getUser()
  },
  methods: {
    getSum() {
      getHomeSum().then(res => {
        this.article_num = res.article_sum
        this.iron_num = res.iron_sum
        this.wuser_num = res.wuser_sum
      })
    },
    getUser() {
      getWxSum().then(res => {
        this.ageData.rows = res.ages
        this.genderData.rows = res.genders
      })
    }
  }
}
</script>
<style lang="scss" scoped>
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
  };
</style>
