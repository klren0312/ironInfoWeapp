<template>
  <el-form  class="user-form" ref="ironForm" label-position="right" label-width="80px"  :model="ironForm">
    <el-form-item label="名称" prop="name">
      <el-select v-model="select">
        <el-option v-for="(v,i) in ironList" :key="i" :value="JSON.stringify(v)" :label="v.name"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="图标链接" prop="icon">
      <el-input v-model="ironForm.icon"></el-input>
    </el-form-item>
    <el-form-item class="btn-group">
      <el-button type="primary" @click="submitForm('ironForm')">保存</el-button>
      <el-button @click="cancel">取消</el-button>
    </el-form-item>
  </el-form>
</template>
<script>
import {createHot} from '@/api/hot.api'
import {getAllIron} from '@/api/iron.api'
export default {
  name: 'createForm',
  data() {
    return {
      ironForm: {
        name: '',
        ironId: '',
        icon: 'default'
      },
      ironList: [],
      select: ''
    }
  },
  mounted() {
    this.getList()
  },
  methods: {
    submitForm: function(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          createHot(this.ironForm).then(res => {
            // console.log(res)
            this.$message({
              type: 'success',
              message: '添加成功'
            });
            this.ironForm = {
              name: '',
              ironId: '',
              icon: 'default'
            }
            this.$emit('cancel')
          }).catch(e => {})
        } else {
          return false;
        }
      });
    },
    cancel: function() {
      this.ironForm = {
        name: '',
        ironId: '',
        icon: 'default'
      }
      this.$emit('cancel')
    },
    /**
     * 获取所有列表
     */
    getList: function() {
      getAllIron().then(res => {
        this.ironList = res
      }).catch(() => {
        this.$message.error('服务器通信错误')
      });
    }
  },
  watch: {
    select: function() {
      let obj = this.select ? JSON.parse(this.select) : {}
      this.ironForm.ironId = obj.id
      this.ironForm.name = obj.name
    }
  }
}
</script>
<style lang="scss">
.user-form {
  .el-select {
    width: 100%;
  }
  .el-input {
    width: 100%;
  }
  .btn-group {
    text-align: right;
  }
}
</style>

