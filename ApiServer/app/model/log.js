'use strict';

/*
  用户日志表
  admin:   用户
  ip:      登录IP
  time:    登录时间
  comment: 说明
  location:地点
  ctrl:    操作数据
*/

module.exports = app => {
  const { INTEGER, STRING, DATE, TEXT } = app.Sequelize;

  const Log = app.model.define('log', {
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
    comment: {
      type: STRING(30),
      allowNull: true,
    },
    time: {
      type: DATE,
      allowNull: true,
    },
    location: {
      type: STRING(233),
      allowNull: true,
    },
    ctrl: {
      type: TEXT,
      allowNull: true,
    },
  }, {
    timestamps: false,
    freezeTableName: true,
    tableName: 'log',
  });


  Log.associate = function() {
    app.model.Log.belongsTo(app.model.User, { foreignKey: 'user_id', targetKey: 'id' });
  };


  return Log;
};
