const path = require('path');

module.exports = appInfo => {
  const config = {};

  config.keys = '123456';
  config.view = {
    mapping: {
      '.nj': 'nunjucks',
      defaultViewEngine: 'nunjucks',
    },
  };

  return config;
};
