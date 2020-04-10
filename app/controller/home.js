const Controller = require('egg').Controller;
const puppeteer = require('puppeteer');

const icon = require('../public/img/icon');
const serachIcon = require('../public/img/search');

class HomeController extends Controller {
  async index() {
    const lyric = [
      'Shall I compare thee to a summer\'s day?',
      'Thou art more lovely and more temperate:',
      'Rough winds do shake the darling buds of May,',
      'And summer\'s lease hath all too short a date:',
      'Sometime too hot the eye of heaven shines,',
      'And often is his gold complexion dimmed,',
      'And every fair from fair sometime declines,',
      'By chance or nature\'s changing course untrimmed:',
      'But thy eternal summer shall not fade',
      'Nor lose possession of that fair thou ow\'st',
      'Nor shall death brag thou wand\'rest in his shade',
      'When in eternal lines to time thou grow\'st:',
      'So long as men can breathe or eyes can see,',
      'So long lives this, and this gives life to thee.',
      '我怎么能够把你来比作夏天呢？',
      '你比它可爱也比它温婉：',
      '狂风把五月的花蕾摇撼，',
      '夏天的足迹匆匆而去：',
      '天上的眼睛有时照得太酷烈，',
      '它那炳耀的金颜又常遭掩蔽：',
      '被机缘或无常的天道所摧折，',
      '没有芳艳不凋残或不销毁。',
      '但是你的长夏永远不会凋歇，',
      '你的美艳亦不会遭到损失，',
      '死神也力所不及，',
      '当你在不朽的诗里与时同长。',
      '只要一天有人类，或人有眼睛，',
      '这诗将长存，并赐予你生命。',
      '第18号十四行诗---莎士比亚',
    ];
    this.ctx.set('Cache-Control', 'max-age=7200000');
    await this.ctx.render('home.nj', { icon, lyric, });
  }

  async dictionary() {
    const searchWord = this.ctx.query.search;
    if (typeof searchWord !== 'string' || searchWord.length <= 0) {
      this.ctx.body = { success: false, msg: 'lack the value of search' };
      return false;
    }

    const cache = await this.ctx.service.lru.get(searchWord);
    if (cache) {
      await this.ctx.render('dictionary.nj', {...JSON.parse(cache), serachIcon});
      return true;
    }

    const vocabulary = await this.ctx.service.vocabularies.get(searchWord);
    if (!vocabulary) {
      const lyric = [
        'No word explanation was found',
        '没搜索到相关单词解释',
      ];
      await this.ctx.render('home.nj', { icon, lyric, });
      return null;
    }

    await this.ctx.service.lru.push(searchWord, JSON.stringify(vocabulary));
    await this.ctx.render('dictionary.nj', {...vocabulary, serachIcon});
  }
}

module.exports = HomeController;
