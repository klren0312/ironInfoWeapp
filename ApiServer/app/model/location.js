'use strict';

/*
  定位表
  latitude:    纬度
  longitude:   经度
*/
module.exports = app => {
  const { STRING } = app.Sequelize;

  const Location = app.model.define('location', {
    latitude: {
      type: STRING,
      allowNull: false,
    },
    longitude: {
      type: STRING,
      allowNull: false,
    },
  }, {
    timestamps: true,
    tableName: 'location',
    underscored: false,
  });

  return Location;
};
