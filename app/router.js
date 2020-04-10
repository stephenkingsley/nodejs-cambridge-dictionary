module.exports = app => {
  const { router, controller } = app;
  router.get('/', controller.home.index);
  router.get('/dictionary', controller.home.dictionary);
  router.get('/api/search', controller.search.index);
};
