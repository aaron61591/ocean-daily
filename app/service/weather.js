'use strict';

const Service = require('egg').Service;
const request = require('request');
const SENIVERSE_WEB_API = 'https://api.seniverse.com/v3/weather/now.json';
const { TABLE_NAME } = require('../contants');

class WeatherService extends Service {

  __getWeatherFromSeniverse(city) {
    return new Promise((resolve, reject) => {
      request.get(
        `${SENIVERSE_WEB_API}?location=${encodeURIComponent(city)}&key=${this.app.config.SENIVERSE_DEV_KEY}`,
        (err, httpResponse, body) => {
          if (err) reject();
          try {
            const weatherRaw = JSON.parse(body).results[0].now;
            resolve({
              temperature: weatherRaw.temperature,
              phenomena: weatherRaw.text,
            });
          } catch (e) {
            reject();
          }
        }
      );
    });
  }

  async get(weatherId) {
    const result = await this.app.mysql.get(TABLE_NAME.WEATHER, {
      id: weatherId,
    });
    return result;
  }

  async create(city) {
    try {
      const { phenomena, temperature } = await this.__getWeatherFromSeniverse(city);
      const result = await this.app.mysql.insert(TABLE_NAME.WEATHER, {
        phenomena, temperature,
        createTime: new Date(),
      });
      return result.insertId;
    } catch (e) {
      return 0;
    }
  }

  async update(row) {
    try {
      const result = await this.app.mysql.update(TABLE_NAME.LOCATION, row);
      return result.affectedRows === 1;
    } catch (e) {
      return false;
    }
  }
}

module.exports = WeatherService;
