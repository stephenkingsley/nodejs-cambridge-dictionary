const Controller = require('egg').Controller;

class SearchController extends Controller {
  async index() {
    const searchWord = this.ctx.query.search;
    if (typeof searchWord !== 'string' || searchWord.length <= 0) {
      this.ctx.body = { success: false, msg: 'lack the value of search', data: null };
      return false;
    }

    const cache = await this.ctx.service.lru.get(searchWord);
    if (cache) {
      this.ctx.body = {
        success: true,
        msg: 'ok',
        data: JSON.parse(cache),
      }
      return true;
    }

    const vocabulary = await this.ctx.service.vocabularies.get(searchWord);
    if (!vocabulary) {
      this.ctx.body = { success: false, msg: 'No word explanation was found', data: null, };
      return null;
    }

    await this.ctx.service.lru.push(searchWord, JSON.stringify(vocabulary));
    this.ctx.body = {
      success: true,
      msg: 'ok',
      data: vocabulary,
    }
  }
}

module.exports = SearchController;
