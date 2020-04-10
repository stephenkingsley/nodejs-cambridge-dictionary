const Controller = require('egg').Controller;
const puppeteer = require('puppeteer');


class HomeController extends Controller {
  async index() {
    this.ctx.body = await this.ctx.render('home.nj');
  }

  async dictionary() {
    const searchWord = this.ctx.query.search;
    if (typeof searchWord !== 'string' || searchWord.length <= 0) {
      this.ctx.body = { success: false, msg: 'lack the value of search' };
      return false;
    }

    const cache = await this.ctx.service.lru.get(searchWord);
    if (cache) {
      await this.ctx.render('dictionary.nj', JSON.parse(cache));
      return true;
    }

    const vocabulary = await this.ctx.service.vocabularies.get(searchWord);
    await this.ctx.service.lru.push(searchWord, JSON.stringify(vocabulary));
    
    await this.ctx.render('dictionary.nj', vocabulary);
  }
}

module.exports = HomeController;
