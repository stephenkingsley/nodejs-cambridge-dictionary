const Controller = require('egg').Controller;
const puppeteer = require('puppeteer');


class HomeController extends Controller {
  async index() {
    this.ctx.body = 'hello';
  }
}

module.exports = HomeController;
