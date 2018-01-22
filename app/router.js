'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;
  router.get('/', controller.home.index);
  router.get('/daily/create', controller.daily.create);
  router.get('/daily/query', controller.daily.query);
  router.post('/daily/create', controller.daily.create);
};
