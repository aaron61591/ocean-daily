'use strict';

const Service = require('egg').Service;
const request = require('request');
const MAP_QQ_API = 'http://apis.map.qq.com/ws/geocoder/v1/';
const { TABLE_NAME } = require('../contants');

class LocationService extends Service {

  getAddressComponentForQQMap(location) {
    return new Promise((resolve, reject) => {
      request.get(
        `${MAP_QQ_API}?location=${location}&key=${this.app.config.QQ_DEV_KEY}`,
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

  async get(locationId) {
    const result = await this.app.mysql.get(TABLE_NAME.LOCATION, {
      id: locationId,
    });
    return result;
  }

  async create(addressComponent) {
    try {
      const { nation, province, city, district, street, street_number } = addressComponent;
      const result = await this.app.mysql.insert(TABLE_NAME.LOCATION, {
        nation, province, city, district, street, streetNumber: street_number,
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

module.exports = LocationService;
