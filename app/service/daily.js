'use strict';

const Service = require('egg').Service;
const { TABLE_NAME } = require('../contants');

class DailyService extends Service {

  async __createDaily(content, locationId, weatherId) {
    const result = await this.app.mysql.insert(TABLE_NAME.DAILY, {
      content, locationId, weatherId,
      status: 1,
      createTime: new Date(),
    });
    return result.insertId;
  }

  async create(location, content) {
    const addressComponent = await this.ctx.service.location.getAddressComponentForQQMap(location);
    const locationId = await this.ctx.service.location.create(addressComponent);
    const weatherId = await this.ctx.service.weather.create(addressComponent.city);
    const dailyId = await this.__createDaily(content, locationId, weatherId);
    this.ctx.service.location.update({ id: locationId, dailyId });
    this.ctx.service.weather.update({ id: weatherId, dailyId });
    return dailyId;
  }

  async __query(offset, limit) {
    return await this.app.mysql.select(TABLE_NAME.DAILY, {
      where: { status: 1 },
      orders: [[ 'createTime', 'desc' ]],
      limit, offset,
    });
  }

  async query(offset, limit) {
    const dailyList = await this.__query(offset, limit);
    for (const daily of dailyList) {
      daily.createTime = +new Date(daily.createTime);
      daily.location = await this.ctx.service.location.get(daily.locationId);
      daily.weather = await this.ctx.service.weather.get(daily.weatherId);
    }
    return dailyList;
  }
}

module.exports = DailyService;
