'use strict';

const Controller = require('egg').Controller;

class DailyController extends Controller {

  async __getUser(param) {
    const { loginCode, rawData, signature } = param;
    const user = await this.ctx.service.user.get(loginCode, rawData, signature);
    return user;
  }

  async create() {
    const user = await this.__getUser(this.ctx.request.body);
    if (!user) {
      this.ctx.body = {
        success: false,
        msg: 'invalid user',
      };
      return;
    }
    const { location, content } = this.ctx.request.body;
    const result = await this.ctx.service.daily.create(user.id, location, content);
    this.ctx.body = {
      success: result !== 0,
    };
  }

  async query() {
    const { offset, limit } = this.ctx.query;
    const user = await this.__getUser(this.ctx.query);
    if (!user) {
      this.ctx.body = [];
      return;
    }
    const dailyList = await this.ctx.service.daily.query(user.id, offset, limit);
    this.ctx.body = dailyList;
  }
}

module.exports = DailyController;
