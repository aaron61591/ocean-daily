'use strict';

const Service = require('egg').Service;
const request = require('request');
const MP_WEB_API = 'https://api.weixin.qq.com/sns/jscode2session';

const CryptoJS = require('crypto-js');

class UserService extends Service {

  async __queryUserFromMPServer(jsCode) {
    return new Promise((resolve, reject) => {
      request.get(
        `${MP_WEB_API}?appid=${this.app.config.MP_APP_ID}&secret=${this.app.config.MP_APP_SECRET}&js_code=${jsCode}&grant_type=authorization_code`,
        (err, httpResponse, body) => {
          if (err) reject();
          try {
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

  async get(jsCode, rawData, signature) {
    const { openid, sessionKey } = await this.__queryUserFromMPServer(jsCode);
    console.log('userInfo.rawData, sessionKey', rawData, sessionKey);
    if (this.__checkSignature(signature, rawData, sessionKey)) console.log('bingo');
  }
}

module.exports = UserService;
