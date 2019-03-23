<template>
  <el-form  class="user-form" label-position="right" label-width="80px" ref="editData" :rules="rules" :model="editData">
    <el-form-item label="密码" prop="password">
      <el-input type="password" v-model="editData.password"></el-input>
    </el-form-item>
    <el-form-item label="电子邮箱" prop="email">
      <el-input type="email" v-model="editData.email"></el-input>
    </el-form-item>
    <el-form-item class="btn-group">
      <el-button type="primary" @click="editForm('editData') ">保存</el-button>
      <el-button @click="cancel">取消</el-button>
    </el-form-item>
  </el-form>
</template>
<script>
import md5 from '@/utils/md5'
import { updateUser } from '@/api/user.api'
export default {
  name: 'editForm',
  props: {
    editData: {
      type: Object
    }
  },
  data() {
    return {
      roleList: [],
      rules: {
        password: [
          { required: true, message: '请输入密码', trigger: 'blur'}
        ],
        email: [
          { type:'email', required: true, message: '请输入邮箱', trigger: 'blur'}
        ]
      }
    }
  },

  methods: {

    editForm: function(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          // console.log(this.editData)
          updateUser(this.editData).then(res => {
            this.$message({
              message: '用户信息修改成功',
              type: 'success'
            });
            this.$emit('cancel')
          }).catch(() => {
            this.$message.error('服务器通信错误')
          })
        } else {
          return false;
        }
      });
    },
    cancel: function() {
      this.$emit('cancel')
    },
    selectChange: function() {
      this.editData.permission = []
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

