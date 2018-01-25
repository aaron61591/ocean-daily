'use strict';

const Controller = require('egg').Controller;

class DailyController extends Controller {

  async create() {
    const { location, content } = this.ctx.request.body;
    const result = await this.ctx.service.daily.create(location, content);
    this.ctx.body = {
      success: result !== 0,
    };
  }

  async query() {
    const { offset, limit, loginCode, rawData, signature } = this.ctx.query;
    console.log('loginCode, rawData, signature', loginCode, rawData, signature);
    const user = await this.ctx.service.user.get(loginCode, rawData, signature);
    const dailyList = await this.ctx.service.daily.query(offset, limit);
    this.ctx.body = dailyList;
  }
}

module.exports = DailyController;
