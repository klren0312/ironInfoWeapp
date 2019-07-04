<template>
  <el-form  class="user-form" ref="ironForm" :rules="rules" label-position="right" label-width="80px"  :model="ironForm">
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
    <el-form-item label="价格" prop="new_price">
      <el-input-number v-model="ironForm.new_price" controls-position="right"></el-input-number>
    </el-form-item>
    <el-form-item label="图片链接" prop="photo">
      <el-input v-model="ironForm.photo"></el-input>
    </el-form-item>
    <el-form-item class="btn-group">
      <el-button type="primary" @click="submitForm('ironForm')">保存</el-button>
      <el-button @click="cancel">取消</el-button>
    </el-form-item>
  </el-form>
</template>
<script>
import {createIron} from '@/api/iron.api'
export default {
  name: 'createForm',
  data() {
    return {
      ironForm: {
        name: '',
        intro: '',
        new_price: 0,
        photo: ''
      },
      rules: {
        name: [
          { required: true, message: '请输入钢材名称', trigger: 'blur'}
        ],
        intro: [
          { required: true, message: '请输入钢材简介', trigger: 'blur'}
        ],
        new_price: [
          {  required: true, message: '请输入钢材价格', trigger: 'blur'}
        ]
      }
    }
  },
  methods: {
    submitForm: function(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          createIron(this.ironForm).then(res => {
            // console.log(res)
            this.$message({
              type: 'success',
              message: '添加成功'
            });
            this.ironForm = {
              name: '',
              intro: '',
              new_price: 0,
              photo: ''
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
        username: '',
        password: '',
        email: ''
      }
      this.$emit('cancel')
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

