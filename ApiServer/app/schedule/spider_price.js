'use strict';

const Subscription = require('egg').Subscription;
const cheerio = require('cheerio');
const tableParser = require('cheerio-tableparser');
const rp = require('request-promise');
const complete = new Set();
/**
 * '2':'圆钢'
 * '3':'螺纹(14mm)'
 * '4':'螺纹(12mm)'
 * '6':'盘螺(10mm)'
 * '8':'盘螺(6mm)'
 * '9':'盘螺(8mm)'
 * '10':'螺纹(16mm)'
 * '11':'螺纹(18mm)'
 * '12':'螺纹(20mm)'
 * '13':'螺纹(22mm)'
 * '14':'螺纹(25mm)'
 * '15':'螺纹(28mm)'
 * '16':'螺纹(32mm)'
 */
// 钢材字典
const ironDict = {
  '螺纹钢Φ12-14': [ 3, 4 ],
  '螺纹钢Φ16-25': [ 10, 11, 12, 13, 14 ],
  '螺纹钢Ф28-32': [ 15, 16 ],
  '盘螺Φ8-10': [ 6, 9 ],
  盘螺Φ6: [ 8 ],
};

// 每天晚上11点半更新价格
class SpiderPrice extends Subscription {
  static get schedule() {
    return {
      cron: '1 30 23 * * *',
      type: 'worker',
    };
  }

  async subscribe() {
    const { ctx } = this;
    const { iron } = ctx.service.v1;

    const today = `${zeroPadding(new Date().getMonth() + 1)}-${zeroPadding(new Date().getDate())}`;
    if (!complete.has(today)) {
      const link = await checkNew();
      if (link) {
        const res = await getPrice(link);
        complete.add(today);
        const filterRes = res.filter(v => v.name.indexOf('高线') === -1);
        filterRes.forEach(v => {
          const ids = ironDict[v.name + v.size];
          for (let i = 0, len = ids.length; i < len; i++) {
            iron.updatePrice({
              id: ids[i],
              price: v.price,
            });
          }
          ctx.logger.info('录入');
        });
      } else {
        ctx.logger.info('今日无数据');
      }
    } else {
      ctx.logger.info('today is complete');
    }
  }
}

/**
 * 判断是否有当天数据
 */
async function checkNew() {
  const listUrl = 'http://hq.zgw.com/hefei/jiancai.html';
  const body = await rp({ uri: listUrl });
  const $ = cheerio.load(body);
  const list = $('body > div.wrap > div.cslm_tit > div.hq_con > div.fl.lm_left > div.lm_list > ul:nth-child(2)').children('li:first-child').text()
    .trim();
  if (list.match(/(\d+-\d+)/)[0] === `${zeroPadding(new Date().getMonth() + 1)}-${zeroPadding(new Date().getDate())}`) {
    const link = $('body > div.wrap > div.cslm_tit > div.hq_con > div.fl.lm_left > div.lm_list > ul:nth-child(2) li:first-child a').attr('href');
    return `http://hq.zgw.com${link}`;
  }
  return false;

}

/**
 * 获取价格
 * @param {string} url 价格页链接
 */
async function getPrice(url) {
  const tableSelector = 'body > div.wrap > div.cslm_tit > div.hq_con > div.fl.lm_left > div > div.lm_m > div.lm_mt > div.article > table';
  const body = await rp({ uri: url });
  const $ = cheerio.load(body);
  const priceCol = spiderTable(tableSelector, $, false)[4];
  priceCol.shift();
  const pricesFormat = priceCol.map(v => $(v).data().type);
  const otherData = spiderTable(tableSelector, $, true);
  const nameCol = otherData[0];
  const sizeCol = otherData[1];
  const modelCol = otherData[2];
  const typeCol = otherData[3];
  nameCol.shift();
  sizeCol.shift();
  modelCol.shift();
  typeCol.shift();
  const ironArr = [];
  for (let i = 0, len = nameCol.length; i < len; i++) {
    ironArr.push({
      name: nameCol[i],
      size: sizeCol[i],
      model: modelCol[i],
      type: typeCol[i],
      price: pricesFormat[i],
    });
  }
  let afterArr = ironArr.filter(v => v.type.indexOf('马钢') !== -1);
  afterArr = afterArr.filter(v => v.model !== 'HRB400E');
  afterArr = afterArr.filter(v => v.name.indexOf('高线') === -1);
  return afterArr;
}

/**
 * 数字补零
 * @param {number} num 数字
 */
function zeroPadding(num) {
  const n = num.toString();
  if (n.length === 1) {
    return `0${n}`;
  }
  return n;

}

/**
 * 解析表格数据
 * @param {string} tableSelector 表格选择器
 * @param {function} $ cheerio
 * @param {boolean} noHtml 是否需要清除html标签
 */
function spiderTable(tableSelector, $, noHtml) {
  tableParser($);
  return $(tableSelector).parsetable(false, false, noHtml);
}

module.exports = SpiderPrice;
