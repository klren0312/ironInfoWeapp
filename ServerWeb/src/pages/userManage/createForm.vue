<template>
  <el-form  class="user-form" ref="userForm" :rules="rules" label-position="right" label-width="80px"  :model="userForm">
    <el-form-item label="用户名" prop="username">
      <el-input v-model="userForm.username"></el-input>
    </el-form-item>
    <el-form-item label="密码" prop="password">
      <el-input type="password" v-model="userForm.password"></el-input>
    </el-form-item>
    <el-form-item label="电子邮箱" prop="email">
      <el-input type="email" v-model="userForm.email"></el-input>
    </el-form-item>
    <el-form-item class="btn-group">
      <el-button type="primary" @click="submitForm('userForm')">保存</el-button>
      <el-button @click="cancel">取消</el-button>
    </el-form-item>
  </el-form>
</template>
<script>
import md5 from '@/utils/md5'
import { addUser } from '@/api/user.api'
export default {
  name: 'createForm',
  data() {
    return {
      userForm: {
        username: '',
        password: '',
        email: '',
      },
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur'}
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur'}
        ],
        email: [
          { type:'email', required: true, message: '请输入邮箱', trigger: 'blur'}
        ]
      }
    }
  },
  created() {
    this.getRoleList()
  },
  methods: {
    submitForm: function(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          addUser(this.userForm).then(res => {
            this.$message({
              type: 'success',
              message: '添加成功'
            });
            this.userForm = {
              username: '',
              password: '',
              email: ''
            }
            this.$emit('cancel')
          }).catch(e => {})
        } else {
          return false;
        }
      });
    },
    cancel: function() {
      this.userForm = {
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

