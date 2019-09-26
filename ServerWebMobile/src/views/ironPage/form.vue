<template>
  <div class="iron-form">
    <z-header
      title="治电科技管理中心-添加钢材"
      left-icon="arrow-left"
      @leftClick="$router.go(-1)"></z-header>
    <md-field>
      <md-input-item title="名称" type="text" v-model="ironForm.name" placeholder="请输入钢材名称"></md-input-item>
      <md-input-item title="价格" type="money" v-model="ironForm.new_price" placeholder="请输入钢材价格"></md-input-item>
      <md-input-item title="简介" type="text" v-model="ironForm.intro" placeholder="请输入钢材简介"></md-input-item>
    </md-field>
    <md-button type="primary" @click="addIron">添加</md-button>
  </div>
</template>
<script>
import { Button, InputItem, Field, Toast } from 'mand-mobile'
import ZHeader from '@/components/ZHeader.vue'
import { createIron } from '@/apis/iron.api'
export default {
  name: 'IronForm',
  components: {
    [Button.name]: Button,
    [InputItem.name]: InputItem,
    [Field.name]: Field,
    ZHeader
  },
  data () {
    return {
      ironForm: {
        name: '',
        new_price: 0,
        intro: ''
      }
    }
  },
  methods: {
    addIron () {
      if (this.ironForm.name === '') {
        Toast.failed('请输入钢材名称!')
        return
      }
      if (this.ironForm.new_price === '') {
        Toast.failed('请输入钢材价格!')
        return
      }
      if (this.ironForm.intro === '') {
        Toast.failed('请输入钢材简介!')
        return
      }
      this.ironForm.new_price = parseInt(this.ironForm.new_price)
      createIron(this.ironForm).then(res => {
        if (res) {
          Toast.succeed('创建成功')
          this.ironForm = {
            name: '',
            new_price: 0,
            intro: ''
          }
        }
      })
    }
  }
}
</script>
