'use strict';

const Controller = require('egg').Controller;

class DailyController extends Controller {

  async create() {
    const { location, content } = this.ctx.query;
    const result = await this.ctx.service.daily.create(location, content);
    this.ctx.body = result;
  }
}

module.exports = DailyController;
