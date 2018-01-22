'use strict';

const Controller = require('egg').Controller;

class DailyController extends Controller {

  async create() {
    const { location, content } = this.ctx.query;
    const result = await this.ctx.service.daily.create(location, content);
    this.ctx.body = result !== 0;
  }

  async query() {
    const { offset, limit } = this.ctx.query;
    const dailyList = await this.ctx.service.daily.query(offset, limit);
    this.ctx.body = dailyList;
  }
}

module.exports = DailyController;
