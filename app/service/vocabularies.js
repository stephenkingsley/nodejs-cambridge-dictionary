const Service = require('egg').Service;
const puppeteer = require('puppeteer');

class VocabulariesService extends Service {
  async get(searchWord) {
    const browser = await puppeteer.launch({args: ['--no-sandbox', '--disable-setuid-sandbox']});
    const page = await browser.newPage();
    await page.setUserAgent('Mozilla/5.0 (iPhone; CPU iPhone OS 10_3 like Mac OS X)');
    await page.setViewport({width:375, height:812});
    try {
      await page.goto(`https://dictionary.cambridge.org/dictionary/english/${searchWord}`);
    } catch (error) {
      console.log('error');
      return null;
    }

    const headwordHandle = await page.$('.headword');
    const headword = await page.evaluate(headword => {
      return headword ? headword.textContent : null;
    }, headwordHandle);

    if (!headword) {
      return null;
    }

    const posgramHandle = await page.$('.posgram');
    const posgram = await page.evaluate(posgram => posgram.textContent, posgramHandle);

    const usDpronHandle = await page.$('.us.dpron-i .pron');
    const usDpron = await page.evaluate(usDpron => usDpron.textContent, usDpronHandle);

    const ukDpronHandle = await page.$('.uk.dpron-i .pron');
    const ukDpron = await page.evaluate(ukDpron => ukDpron.textContent, ukDpronHandle);

    const def = await page.$$eval('.def', def => def.map(item => item.textContent));
    const dsense = await page.$$eval('.dsense_h', dsense => dsense.map(item => item.textContent));
    const defBody = await page.$$eval('.def-body', defBody => defBody.map(item => item.textContent));

    const meaningList = def.map((ele, index) => {
      return {
        def: def[index],
        dsense: dsense[index],
        defBody: defBody,
      };
    });

    const moreEg = await page.$$eval('.eg.dexamp.hax', eg => eg.map(item => item.textContent));
    await browser.close();

    return {
      word: headword,
      posgram: posgram,
      usPhonogram: usDpron,
      ukPhonogram: ukDpron,
      meaningList: meaningList,
      examples: moreEg,
    };
  }
}

module.exports = VocabulariesService;
