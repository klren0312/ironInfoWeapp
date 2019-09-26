<template>
  <div class="hot-page">
    <z-header
      title="治电科技管理中心-热门钢材"
      right-icon="edit"
      @rightClick="openSelector"
      left-icon="arrow-left"
      @leftClick="$router.go(-1)"></z-header>
    <draggable
      :list="list"
      class="the-list"
      ghost-class="ghost"
      :move="checkMove"
      @start="dragging = true"
      @end="dragging = false"
    >
      <z-card
        v-for="v in list"
        :key="v.id">
        <div slot="left">
          <div class="z-card-title">{{v.name}}</div>
          <div class="z-card-info">{{day(v.createdAt).format('YYYY-MM-DD')}}</div>
        </div>
        <template slot="right">
          <div class="ctrl-btn-group">
          </div>
        </template>
        <template slot="btn">
          <button class="z-card-btn del-btn"  @click="delHot(v.id)">删除</button>
        </template>
      </z-card>
    </draggable>
    <md-selector
      v-model="showSelector"
      :data="ironList"
      max-height="380px"
      title="选择热门钢材"
      okText="确认"
      large-radius
      @confirm="selectHotIron"
    ></md-selector>
  </div>
</template>
<script>
import { Button, Dialog, Toast, Selector } from 'mand-mobile'
import draggable from 'vuedraggable'
import ZHeader from '@/components/ZHeader.vue'
import ZCard from '@/components/ZCard.vue'
import { getHot, deleteHot, createHot, updateSort } from '@/apis/hot.api'
import { getAllIron } from '@/apis/iron.api'
import { debounce, deepCopy } from 'zmethods'
import dayjs from 'dayjs'
export default {
  name: 'HotPage',
  components: {
    [Button.name]: Button,
    [Dialog.name]: Dialog,
    [Toast.name]: Toast,
    [Selector.name]: Selector,
    draggable,
    ZHeader,
    ZCard
  },
  data () {
    return {
      list: [],
      dragging: false,
      day: dayjs,
      ironList: [],
      showSelector: false
    }
  },
  async mounted () {
    await this.getHotList()
    this.getIron()
  },
  methods: {
    getHotList () {
      return getHot().then(res => {
        this.list = res
      })
    },
    getIron () {
      getAllIron().then(res => {
        let irons = res.map(v => {
          return {
            value: v.id,
            text: v.name,
            brief: v.intro
          }
        })
        let hotIds = this.list.map(v => v.ironId)
        this.ironList = irons.filter(v => hotIds.indexOf(v.value) === -1)
      })
    },
    delHot (id) {
      Dialog.confirm({
        title: '删除热门钢材',
        content: '此操作将永久删除该热门钢材, 是否继续',
        confirmText: '继续',
        onConfirm: () => {
          deleteHot(id).then(res => {
            if (res) {
              const index = this.list.findIndex(v => v.id === id)
              this.list.splice(index, 1)
              Toast.succeed('删除成功')
            }
          })
        }
      })
    },
    checkMove: debounce(function () {
      this.updateHot()
    }, 800),
    /**
     * 更新排序
     */
    updateHot () {
      let arr = deepCopy(this.list)
      updateSort(arr).then(res => {})
    },
    /**
     * 打开选择器
     */
    openSelector () {
      if (this.list.length === 6) {
        Toast.failed('只能添加六个热门钢材, 请删除后添加')
        return
      }
      this.showSelector = true
    },
    /**
     * 选择热门钢材
     */
    selectHotIron (obj) {
      createHot({
        name: obj.text,
        ironId: obj.value,
        icon: 'default'
      }).then(async res => {
        Toast.succeed('添加成功')
        await this.getHotList()
      })
    }
  }
}
</script>
<style lang="scss" scope>

</style>
