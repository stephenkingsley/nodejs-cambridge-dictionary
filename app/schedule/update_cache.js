const Subscription = require('egg').Subscription;
const fs = require('fs');
const path = require('path');

class UpdateCache extends Subscription {
  // 通过 schedule 属性来设置定时任务的执行间隔等配置
  static get schedule() {
    return {
      immediate: true,
      interval: '24h', // 1 分钟间隔
      type: 'all', // 指定所有的 worker 都需要执行
    };
  }

  // subscribe 是真正定时任务执行时被运行的函数
  async subscribe() {
    fs.readdir(path.join(__dirname, '../vocabularies-cache'), (err, files) => {
      files.forEach(fileName => {
        setTimeout(() => {
          fs.unlink(path.join(__dirname, `../vocabularies-cache/${fileName}`));
        }, 1000);
      });
    });
  }
}

module.exports = UpdateCache;
