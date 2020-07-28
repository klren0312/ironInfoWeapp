<template>
  <div class="iron-page">
    <z-header
      title="治电科技管理中心-钢材列表"
      right-icon="edit"
      @rightClick="$router.push('/ironForm')"
      left-icon="arrow-left"
      @leftClick="$router.go(-1)"></z-header>
    <div class="iron-list">
      <md-scroll-view
        ref="scrollView"
        :scrolling-x="false"
        @end-reached="onEndReached"
        style="height: calc(100vh - 60px)">
        <z-card
          :useImg="true"
          v-for="v in ironList"
          :key="v.id">
          <img class="z-card-img" v-if="v.photo" :src="v.photo" alt="钢材图片" slot="image">
          <img class="z-card-img" v-else src="https://zzes-1251916954.cos.ap-shanghai.myqcloud.com/Ocean.jpg" alt="" slot="image">
          <div slot="left">
            <div class="z-card-title">{{v.name}}</div>
            <div class="z-card-info">{{v.intro}}</div>
            <div class="z-card-info">价格: ￥{{v.new_price}}</div>
          </div>
          <template slot="right">
            <div class="ctrl-btn-group">
              <md-button type="link" size="small" :round="false" plain @click="seeHistoryPrice(v)">
                <i class="iconfont icon-chart"></i>
              </md-button>
              <md-button type="link" size="small" :round="false" inline plain @click="popPrice(v.id)">
                <i class="iconfont icon-add"></i>
              </md-button>
            </div>
          </template>
          <template slot="btn">
            <button class="z-card-btn del-btn"  @click="delIron(v.id)">删除</button>
          </template>
        </z-card>
        <md-scroll-view-more
          slot="more"
          :is-finished="isFinished"
        >
        </md-scroll-view-more>
      </md-scroll-view>
    </div>
    <!-- 价格折线图 -->
     <md-popup
      v-model="pricePopup"
      position="bottom">
      <div class="price-chart-block">
        <div class="price-chart-header">历史价格折线图</div>
        <md-chart
          :labels="chartTime"
          :datasets="[
            {
              color: '#5e64ff',
              width: 1,
              theme: 'region',
              values: chartData
            }
          ]"
        />
      </div>
    </md-popup>
    <!-- 价格输入弹框 -->
    <md-dialog
      title="添加最新价格"
      :closable="true"
      v-model="priceDialog"
      :btns="dialogBtns">
      <md-codebox
       :system='true'
        :maxlength="-1"
        v-model="newPrice"
      />
    </md-dialog>
  </div>
</template>
<script>
import { Button, Dialog, Codebox, Toast, ScrollView, ScrollViewMore, Popup, Chart } from 'mand-mobile'
import ZHeader from '@/components/ZHeader.vue'
import ZCard from '@/components/ZCard.vue'
import { getIron, getPriceById, addNewPrice, deleteIron } from '@/apis/iron.api'
import dayjs from 'dayjs'
import { queryFormat } from 'zmethods'
export default {
  name: 'IronPage',
  components: {
    [Button.name]: Button,
    [Dialog.name]: Dialog,
    [Codebox.name]: Codebox,
    [Toast.name]: Toast,
    [ScrollView.name]: ScrollView,
    [ScrollViewMore.name]: ScrollViewMore,
    [Popup.name]: Popup,
    [Chart.name]: Chart,
    ZHeader,
    ZCard
  },
  data () {
    this.dialogBtns = [
      {
        text: '取消',
        handler: this.priceDialog = false
      },
      {
        text: '确认操作',
        handler: this.setPrice
      }
    ]
    return {
      ironList: [],
      isFinished: false,
      total: 0,
      query: {
        pageIndex: 1,
        pageSize: 10
      },
      priceDialog: false,
      pricePopup: false,
      editPriceId: null,
      newPrice: '0',
      chartTime: ['12-05', '12-10', '12-13', '12-29', '03-15', '07-20', '08-01', '08-21'],
      chartData: [0, 3850, 3830, 3840, 3780, 4170, 4110, 3910]
    }
  },
  computed: {
    queryString () {
      return queryFormat(this.query)
    }
  },
  mounted () {
    this.getIrons()
  },
  methods: {
    /**
     * 到底加载
     */
    onEndReached () {
      if (this.isFinished) {
        return
      }
      ++this.query.pageIndex
      getIron(this.queryString).then(res => {
        this.query.pageSize = res.pageSize
        this.query.pageIndex = res.pageIndex
        this.ironList = [ ...this.ironList, ...res.items ]
        this.$refs.scrollView.finishLoadMore()
      })
    },
    getIrons () {
      getIron(this.queryString).then(res => {
        this.query.pageSize = res.pageSize
        this.query.pageIndex = res.pageIndex
        this.ironList = res.items
      })
    },
    /**
     * 查看历史底部弹框
     */
    seeHistoryPrice (v) {
      let timeArr = []
      let dataArr = []
      getPriceById(v.id).then(res => {
        res.forEach(u => {
          timeArr.push(dayjs(u.createdAt).format('MM-DD'))
          dataArr.push(u.price)
        })
        this.chartTime = timeArr
        this.chartData = dataArr
        this.$nextTick(_ => {
          this.pricePopup = true
        })
      })
      // console.log(dataArr, timeArr)
    },
    /**
     * 新价格弹框
     */
    popPrice (id) {
      this.editPriceId = id
      this.priceDialog = true
    },
    /**
     * 添加新价格
     */
    setPrice () {
      const result = Number(this.newPrice)
      if (isNaN(result)) {
        Toast.failed('请输入数字')
      } else {
        addNewPrice(this.editPriceId, this.newPrice).then(res => {
          Toast.succeed('添加成功')
        })
      }
    },
    /**
     * 删除钢材
     */
    delIron (id) {
      Dialog.confirm({
        title: '删除钢材',
        content: '此操作将永久删除该钢材, 是否继续',
        confirmText: '继续',
        onConfirm: () => {
          deleteIron(id).then(res => {
            if (res) {
              const index = this.ironList.findIndex(v => v.id === id)
              this.ironList.splice(index, 1)
              Toast.succeed(res.message)
            }
          })
        }
      })
    }
  }
}
</script>
<style lang="scss" scope>
.iron-page {
  .iron-list {
    padding: 20px;
    background: rgb(249, 250, 251);
  }
  .ctrl-btn-group {
    display: flex;
    align-items: center;
  }
}
.price-chart-block {
  background: #fff;
  .price-chart-header {
    padding: 20px 20px;
    margin-bottom: 20px;
    border-bottom: 1px solid #ddd;
    font-size: 40px;
  }
}
</style>
