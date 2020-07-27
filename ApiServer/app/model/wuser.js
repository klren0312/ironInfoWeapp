'use strict';

/*
  用户表
  openid:      openId
  avatar:      头像
  city:        城市
  province:    省份
  country:     国家
  gender:      性别
  language:    语言
  name:        昵称
  count:       访问小程序次数
  userId:      绑定的用户id
*/
module.exports = app => {
  const { STRING, INTEGER } = app.Sequelize;

  const Wuser = app.model.define('wuser', {
    id: {
      type: INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true,
    },
    openId: {
      type: STRING,
      unique: true,
      allowNull: false,
    },
    avatarUrl: {
      type: STRING,
      allowNull: true,
    },
    nickName: {
      type: STRING,
      allowNull: true,
    },
    gender: {
      type: INTEGER,
      allowNull: true,
    },
    language: {
      type: STRING,
      allowNull: true,
    },
    city: {
      type: STRING,
      allowNull: true,
    },
    province: {
      type: STRING,
      allowNull: true,
    },
    country: {
      type: STRING,
      allowNull: true,
    },
    count: {
      type: INTEGER,
      allowNull: true,
    },
    userId: {
      type: INTEGER,
      allowNull: true,
    },
  }, {
    timestamps: true,
    tableName: 'wuser',
    underscored: false,
  });

  return Wuser;
};
