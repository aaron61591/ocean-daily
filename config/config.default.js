'use strict';

// module.exports = appInfo => {
//   const config = {};
//   config.
//   return config;
// };

exports.keys = '写一个随机数，不要告诉别人哈';

exports.mysql = {
  // 单数据库信息配置
  client: {
    // host
    host: 'localhost',
    // 端口号
    port: '3306',
    // 用户名
    user: 'root',
    // 密码
    password: '',
    // 数据库名
    database: 'ocean_daily',
  },
  // 是否加载到 app 上，默认开启
  app: true,
  // 是否加载到 agent 上，默认关闭
  agent: false,
};
