'use strict';

const Service = require('egg').Service;

class CarService extends Service {
  /**
   * 获取所有汽车信息
   */
  async getAllCars() {
    return await this.ctx.modelcar.Car.findAll();
  }
}

module.exports = CarService;
