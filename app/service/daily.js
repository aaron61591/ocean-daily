'use strict';

const Service = require('egg').Service;
const { TABLE_NAME } = require('../contants');

class DailyService extends Service {

  async __createDaily(content, userId, locationId, weatherId) {
    const result = await this.app.mysql.insert(TABLE_NAME.DAILY, {
      content, userId, locationId, weatherId,
      status: 1,
      createTime: new Date(),
    });
    return result.insertId;
  }

  async create(userId, location, content) {
    const addressComponent = await this.ctx.service.location.getAddressComponentForQQMap(location);
    const locationId = await this.ctx.service.location.create(addressComponent);
    const weatherId = await this.ctx.service.weather.create(addressComponent.city);
    const dailyId = await this.__createDaily(content, userId, locationId, weatherId);
    await this.ctx.service.location.update({ id: locationId, dailyId });
    await this.ctx.service.weather.update({ id: weatherId, dailyId });
    return dailyId;
  }

  async __query(userId, offset, limit) {
    return await this.app.mysql.select(TABLE_NAME.DAILY, {
      where: { userId, status: 1 },
      orders: [[ 'createTime', 'desc' ]],
      limit, offset,
    });
  }

  async query(userId, offset, limit) {
    const dailyList = await this.__query(userId, offset, limit);
    for (const daily of dailyList) {
      daily.createTime = +new Date(daily.createTime);
      daily.location = await this.ctx.service.location.get(daily.locationId);
      daily.weather = await this.ctx.service.weather.get(daily.weatherId);
    }
    return dailyList;
  }
}

module.exports = DailyService;
