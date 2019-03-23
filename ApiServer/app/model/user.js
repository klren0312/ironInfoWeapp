'use strict'

/*
  用户表
  username:    用户名
  password:    密码
  email:       邮箱
  avatar:      头像
  status:      启用状态
*/
module.exports = app => {
  const { STRING, BOOLEAN } = app.Sequelize

  const User = app.model.define('user', {
    username: {
      type: STRING,
      unique: true,
      allowNull: false,
      validate: {
        is: /^[a-zA-Z]{1}([a-zA-Z0-9]|[._]){1,50}$/i,
        isLowercase: true,
      }
    },
    password: {
      type: STRING,
      allowNull: true,
    },
    email: {
      type: STRING,
      unique: true,
      allowNull: false,
      validate: {
        isEmail: true,
        isLowercase: true
      }
    },
    avatar: {
      type: STRING,
      allowNull: true
    },
    status: {
      type: BOOLEAN,
      allowNull: false,
      defaultValue: true
    }
  }, {
      timestamps: true,
      tableName: 'user',
      underscored: false
    })

  User.associate = function () {
    app.model.User.hasMany(app.model.Log)
  }

  return User
}