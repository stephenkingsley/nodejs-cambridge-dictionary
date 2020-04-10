const Service = require('egg').Service;
const fs = require('fs');
const path = require('path');

const readFilePromise = (key) => {
  return new Promise(resolve => {
    fs.readFile(path.join(__dirname, `../cache/${key}`), 'utf8', (err, data) => {
      if (err) {
        resolve(null);
      } else {
        resolve(data)
      }
    });
  });
};

class LRUService extends Service {
  async get(key) {
    return await readFilePromise(key)
  }

  async push(key, value) {
    const result = await fs.writeFile(path.join(__dirname, `../cache/${key}`), value, 'utf8');
    return result;
  }
}

module.exports = LRUService;
