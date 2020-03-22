<template>
  <div class="shop-page">
    <z-header
      title="钢材商城"
      left-icon="arrow-left"
      @leftClick="$router.go(-1)">
    </z-header>
    <md-scroll-view
      ref="scrollView"
      :scrolling-x="false"
      style="height: calc(100vh - 60px)"
      auto-reflow>
      <div class="product-list">
        <template v-for="v in irons">
          <div class="product-item" :key="v.id">
            <div class="card">
              <div class="content">
                <img class="img" :src="v.photo"/>
                <div class="price-block">
                  <div class="name">{{v.name}}</div>
                  <div class="price">￥ {{v.new_price }}</div>
                </div>
              </div>
              <md-button @click="pay(v)" class="bottom-btn" size="small" type="primary">购买</md-button>
            </div>
          </div>
        </template>
      </div>
    </md-scroll-view>
    <md-cashier
      ref="cashier"
      v-model="isCashierhow"
      :channels="cashierChannels"
      :channel-limit="2"
      :payment-amount="cashierAmount"
      payment-describe="关于支付金额的特殊说明"
      large-radius
      @select="onCashierSelect"
      @pay="onCashierPay"
      @cancel="onCashierCancel">
      <div slot-scope="{ scene }" slot="header">
        <md-notice-bar
          v-if="scene === 'choose'"
          mode="closable"
          icon="warn"
          type="warning"
        >
          钢材购买为定量销售, 一次需购买233吨
        </md-notice-bar>
      </div>
    </md-cashier>
  </div>
</template>
<script>
import { Button, Toast, ScrollView, Cashier, NoticeBar } from 'mand-mobile'
import { guid } from 'zmethods'
import { pay, getPayStatus } from '@/apis/buy.api'
import ZHeader from '@/components/ZHeader.vue'
import { getAllIron } from '@/apis/iron.api.js'
export default {
  name: 'ShopPage',
  components: {
    [Button.name]: Button,
    [Toast.name]: Toast,
    [ScrollView.name]: ScrollView,
    [Cashier.name]: Cashier,
    [NoticeBar.name]: NoticeBar,
    ZHeader
  },
  data () {
    return {
      irons: [],
      isCashierhow: false,
      cashierAmount: '100.00',
      cashierChannels: [{
        icon: 'cashier-alipay',
        text: '支付宝支付',
        value: '001'
      }, {
        icon: 'cashier-wechat',
        text: '微信支付',
        value: '002',
        disabled: true,
        desc: '暂不可用'
      }],
      selectPay: '001',
      cashierResult: 'success',
      buyData: {
        outTradeNo: '',
        totalAmount: 0,
        subject: '',
        body: '请帮我把房子盖好',
        address: '手机端默认',
        mobile: '15733883388',
        number: 233
      }
    }
  },
  computed: {
    cashier () {
      return this.$refs.cashier
    }
  },
  mounted () {
    this.getIrons()
  },
  methods: {
    async getIrons () {
      const irons = await getAllIron()
      if (irons) {
        this.irons = irons
      }
    },
    /**
     * 处理支付
     */
    async doPay () {
      const formStr = await pay(this.buyData)
      const formDiv = document.createElement('div')
      formDiv.style.display = 'none'
      formDiv.innerHTML = formStr
      document.body.appendChild(formDiv)
      document.getElementById(formStr.match(/id="(\S+)"/)[1]).submit()
      const result = await this.createPay()
      console.log(result)
      if (result.status) {
        this.cashier.next(this.cashierResult, {
          buttonText: '好的',
          handler: () => {
            this.isCashierhow = false
          }
        })
      }
    },
    // Create a pay request & check pay result
    createPay () {
      this.cashier.next('loading')
      return getPayStatus(this.buyData.outTradeNo)
    },
    onCashierSelect (item) {
      this.selectPay = item.value
    },
    onCashierPay (item) {
      this.doPay()
    },
    onCashierCancel () {
      // Abort pay request or checking request
      this.timer && clearTimeout(this.timer)
    },
    pay (v) {
      this.buyData.outTradeNo = guid()
      this.buyData.totalAmount = v.new_price * 233
      this.buyData.subject = v.name
      this.cashierAmount = this.buyData.totalAmount.toString()
      this.isCashierhow = true
    }
  }
}
</script>
<style lang="scss">
  .product-list {
    padding-top: 20px;
    display: flex;
    flex-wrap: wrap;
    .product-item {
      padding: 0 20px;
      margin-bottom: 20px;
      height: 400px;
      width: 50%;
      box-sizing: border-box;
      .card {
        position: relative;
        width: 100%;
        height: 100%;
        box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
        .bottom-btn {
          position: absolute;
          bottom: 0;
          background-image: linear-gradient(to right, #ed6ea0 0%, #ec8c69 100%);
          &.md-button.primary:after {
            border: 0;
          }
        }
        .price-block {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 10px;
          .price {
            padding-right: 20px;
            text-align: right;
            font-size: 28px;
            color: chocolate;
          }
          .name {
            font-size: 28px;
          }
        }
        .img {
          display: block;
          width: 100%;
          height: 270px;
        }
      }
    }
  }
  .item-icon.cashier-alipay {
    background: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAAAcCAYAAAByDd+UAAAB7ElEQVR4Ac2WA6weQRSFb62gtuPajetGtW0FNcO6cVK7XdRu2Ia149R2Z6bP9r6T+yb5bZ7k/Bh9gzt3l1hXfzUiS+4iU36GK2AnTq6AP/PYJ/42JhZ+oPAp7CTWYDDUVHu4IDneCaD8kkTgV4r4zA5+akBuivhMI56llyLv768wXkpfYNK3NGXAaHQhpxlHY9KAlpwc6Qojt6W2urZYnYoFWA5XhWhTSaf/dmHYDqc2/v+NFPiZDLmKzv7pxAPAZIvWZPwbjrqN8B242LU6edUtgMZGGjS3XI8R6IRTj/yI2xhiPNofA7CPCyiuRAL8wM9FUy6AH8I5urwE/gwb8FSdS311+ldz1KsIgGIpmWpNGEGSQYbaC7f1gWIyPClD3uaJBgWeld3x/S3MyCwkWwz1AfqsWCzV8EIfIAeJqd6GAcuHx7oFylz4AVlqGl116gQ/c3HABTTkFH1pywPD1Esy//V0wdQMlJe6Rex3MtQ2OvO/fRgZXbziGVqqP+CmXm0m/AED2WT9G0GOU4sg/sYVCZLCyngrLTHRJ9K9Gl4jWzShYDoj+5Ih7keQiSQWcwgTHqKBPrP8wanK/D+QLzwOH4DeOgDu+maeiPwmBS9RuFNJA1pyV9JfhF33BHS9vZVxhFTWjCn2kYZVAyRlGm3AoxGeAAAAAElFTkSuQmCC') center no-repeat;
    background-size: 26px;
  }
  .item-icon.cashier-wechat {
    background: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAAAYCAYAAADpnJ2CAAABiklEQVR4AbWVAWRCURSGf8gIGQyYgUEAgyAAbCCAAAQQGBAYIGAwAAgIwAMJGIsqRTAgQPAQEsKDu//kXHLddV+v+w6f0HnvP/e8/5yLYPzgAXN0yICsSUoyZUeW+l/nlFs45miSRF9scpKRBDM0rhGqacXmRobhE8/wwsQtMZHYyjv/E2swYU9MZPZW1DVGWoLYEQt88ffR/W7DyEIHCn3ab4gVKpjhzbayHlOI9K2QHqZFNsSctKSSCEI78oE17h1PTJy8PnRwjYdNjlanpEdqsLHC04XnltA2+KuWiudoe9y7xQLvWKF6JlSVE5DjxZZf3CRs91nV3zqjXYxw55iuk9PlGQKJGaZ4hoR123lM8cqc3yu+dSqC40BS4lkSdf9zQcY4tSic2LQLQgc5K+jmrl3Wu0DiUkxy4+o72LEJnDISUrDjtKREwTHc0DkalSA2sfPqE62oKWKJDWRmgzd+BKENaUGjLMGjzmbbLoiigmvSk/tMnKa3y0DQ9vdIM9S6gKCK6FqLGX+Ik2Cgy7oRZQAAAABJRU5ErkJggg==') center no-repeat;
    background-size: 26px;
  }
</style>
