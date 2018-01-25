'use strict';

const Service = require('egg').Service;
const request = require('request');
const MP_WEB_API = 'https://api.weixin.qq.com/sns/jscode2session';
const { TABLE_NAME } = require('../contants');
const CryptoJS = require('crypto-js');

class UserService extends Service {

  async __queryUserFromMPServer(jsCode) {
    return new Promise((resolve, reject) => {
      request.get(
        `${MP_WEB_API}?appid=${this.app.config.MP_APP_ID}&secret=${this.app.config.MP_APP_SECRET}&js_code=${jsCode}&grant_type=authorization_code`,
        (err, httpResponse, body) => {
          if (err) reject();
          try {
            console.log('body', body);
            const dataPackage = JSON.parse(body);
            resolve({
              openid: dataPackage.openid,
              sessionKey: dataPackage.session_key,
            });
          } catch (e) {
            reject();
          }
        }
      );
    });
  }

  __checkSignature(signature, rawData, sessionKey) {
    return signature === CryptoJS.SHA1(rawData + sessionKey).toString();
  }

  async __getAndSet(openid, rawData) {
    const userInfo = JSON.parse(rawData);
    let user = await this.app.mysql.get(TABLE_NAME.USER, { openid });
    if (!user) {
      const result = await this.app.mysql.insert(TABLE_NAME.USER, {
        openid, ...userInfo, createTime: new Date(),
      });
      user = { id: result.insertId };
    }
    return user;
  }

  async get(jsCode, rawData, signature) {
    const { openid, sessionKey } = await this.__queryUserFromMPServer(jsCode);
    if (!this.__checkSignature(signature, rawData, sessionKey)) return;
    return await this.__getAndSet(openid, rawData);
  }
}

module.exports = UserService;
