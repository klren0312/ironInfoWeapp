'use strict';

/*
  用户日志表
  admin:   用户
  ip:      登录IP
  time:    登录时间
  ctrl:    操作数据
*/

module.exports = app => {
  const { INTEGER, STRING, DATE, TEXT } = app.Sequelize;

  const Record = app.model.define('record', {
    id: {
      type: INTEGER(11),
      primaryKey: true,
      allowNull: false,
      autoIncrement: true,
    },
    admin: {
      type: STRING(11),
      allowNull: false,
    },
    ip: {
      type: STRING(30),
      allowNull: true,
    },
    time: {
      type: DATE,
      allowNull: true,
    },
    ctrl: {
      type: TEXT,
      allowNull: true,
    },
  }, {
    timestamps: false,
    freezeTableName: true,
    tableName: 'record',
  });


  return Record;
};
