'use strict';

const Service = require('egg').Service;
const request = require('request');
const MAP_QQ_API = 'http://apis.map.qq.com/ws/geocoder/v1/';
const QQ_DEV_KEY = 'MW6BZ-UCXKO-ZGIWA-SON42-IWT2K-FZF2Y';

class DailyService extends Service {

  __getAddressComponentForQQMap(location) {
    return new Promise((resolve, reject) => {
      request.get(
        `${MAP_QQ_API}?location=${location}&key=${QQ_DEV_KEY}`,
        (err, httpResponse, body) => {
          if (err) reject();
          try {
            const addressComponent = JSON.parse(body).result.address_component;
            resolve(addressComponent);
          } catch (e) {
            console.log(e);
            reject();
          }
        }
      );
    });
  }

  async __createLocation(addressComponent) {
    const { nation, province, city, district, street, street_number } = addressComponent;
    const result = await this.app.mysql.insert('location', {
      nation, province, city, district, street, streetNumber: street_number,
    });
    return result.insertId;
  }

  async __createDaily(content, locationId) {
    const result = await this.app.mysql.insert('daily', {
      content, locationId,
      status: 1,
    });
    return result.affectedRows === 1;
  }

  async create(location, content) {
    const addressComponent = await this.__getAddressComponentForQQMap(location);
    const locationId = await this.__createLocation(addressComponent);
    if (!locationId) return false;
    const result = await this.__createDaily(content, locationId); 
    return result;
  }
}

module.exports = DailyService;
