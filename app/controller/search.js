const Controller = require('egg').Controller;
const puppeteer = require('puppeteer');

class SearchController extends Controller {
  async index() {
    const searchWord = this.ctx.query.search;
    if (typeof searchWord !== 'string' || searchWord.length <= 0) {
      this.ctx.body = {
        success: false,
        msg: 'lack the value of search'
      };
      return false;
    }

    const cache = await this.ctx.service.lru.get(searchWord);
    if (cache) {
      this.ctx.body = {
        success: true,
        msg: 'ok',
        data: JSON.parse(cache),
      };
      return true;
    }

    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setUserAgent('Mozilla/5.0 (iPhone; CPU iPhone OS 10_3 like Mac OS X)');
    await page.setViewport({width:375, height:812});
    await page.goto(`https://dictionary.cambridge.org/dictionary/english/${searchWord}`);

    const headwordHandle = await page.$('.headword');
    const headword = await page.evaluate(headword => headword.textContent, headwordHandle);

    const posgramHandle = await page.$('.posgram');
    const posgram = await page.evaluate(posgram => posgram.textContent, posgramHandle);

    const usDpronHandle = await page.$('.us.dpron-i .pron');
    const usDpron = await page.evaluate(usDpron => usDpron.textContent, usDpronHandle);

    const ukDpronHandle = await page.$('.uk.dpron-i .pron');
    const ukDpron = await page.evaluate(ukDpron => ukDpron.textContent, ukDpronHandle);

    const defHandle = await page.$('.def');
    const def = await page.evaluate(def => def.textContent, defHandle);

    const defBodyHandle = await page.$('.def-body');
    const defBody = await page.evaluate(defBody => {
      const result = [];
      const nums = defBody.childElementCount;
      for (let i = 0; i < nums; i += 1) {
        result.push(defBody.children[i].textContent);
      }
      return result;
    }, defBodyHandle);

    const moreEg = await page.$$eval('.eg.dexamp.hax', eg => eg.map(item => item.textContent));
    await browser.close();

    const data = {
      word: headword,
      posgram: posgram,
      usPhonogram: usDpron,
      ukPhonogram: ukDpron,
      meaning: def,
      meaningDetails: defBody,
      examples: moreEg,
    };
    await this.ctx.service.lru.push(searchWord, JSON.stringify(data));

    this.ctx.body = {
      success: true,
      msg: 'ok',
      data,
    };
  }
}

module.exports = SearchController;
