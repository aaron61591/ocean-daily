'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;
  router.get('/', controller.home.index);
  // router.get('/ocean-daily/daily/create', controller.daily.create);
  router.get('/ocean-daily/daily', controller.daily.query);
  router.post('/ocean-daily/daily', controller.daily.create);
};
