'use strict';

const Subscription = require('egg').Subscription;
const puppeteer = require('puppeteer');
const path = require('path');

class SpiderArticle extends Subscription {
  static get schedule() {
    return {
      cron: '1 30 23 * * *',
      type: 'worker',
    };
  }

  async subscribe() {
    const { ctx } = this;
    const { article } = ctx.service.v1;
    puppeteer.launch({
      headless: true,
      args: [ // 禁用一些功能
        '--no-sandbox', // 沙盒模式
        '--disable-setuid-sandbox', // uid沙盒
        '--disable-dev-shm-usage', // 创建临时文件共享内存
        '--disable-accelerated-2d-canvas', // canvas渲染
        '--disable-gpu', // GPU硬件加速
      ],
      ignoreDefaultArgs: [ '--enable-automation' ],
      defaultViewport: {
        width: 1366,
        height: 768,
      },
    }).then(async browser => {
      const page = await browser.newPage();
      page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.70 Safari/537.36');
      await page.goto('http://hq.zgw.com/huizong/jiancai.html', {
        waitUntil: 'networkidle0',
      });
      const time = await page.$eval('.lm_list > ul:nth-child(2) > li:nth-child(1) > span', a => a.innerHTML);
      if (time === getToday()) {
        const url = await page.$eval('.fl.lm_left >.lm_list > ul:nth-child(2) > li:nth-child(1) > a', a => a.href);
        await page.goto(url, {
          waitUntil: 'networkidle0',
        });
        const dateString = await page.$eval('body > div.wrap > div.cslm_tit > div.hq_con > div.fl.lm_left > div > div.lm_m > div.lm_mt > div.time', a => {
          return a.innerHTML;
        });
        const table = await page.$('.neirong > table');
        const date = dateString.match(/\d+-\d+-\d+/);
        await table.screenshot({
          path: path.resolve(`${date}.png`),
        });
        save(path.resolve(`${date}.png`), `${date}`);
        const articleTitle = await page.$eval('body > div.wrap > div.cslm_tit > div.hq_con > div.fl.lm_left > div > div.lm_m > div.lm_mt > h3', a => {
          return a.innerHTML;
        });
        const result = await article.create({
          title: articleTitle,
          content: `![](http://qiniui.zzes1314.cn/${date})`,
        });
        if (result) {
          ctx.logger.info('录入成功');
        } else {
          ctx.logger.info('录入失败');
        }
      }
      await browser.close();
    }).catch(e => {
      ctx.logger.error(e);
    });
  }
}

/**
 * 获取今日日期字符串
 */
function getToday() {
  const month = new Date().getMonth() + 1;
  const day = new Date().getDate();
  let today = '';
  if (month < 10) {
    today += `0${month}`;
  } else {
    today += month + '';
  }

  if (day < 10) {
    today += `-0${day}`;
  } else {
    today += `-${day}`;
  }

  return today;
}

/**
 * 延时
 * @param {Number} time
 */
function sleep(time) {
  return new Promise((resolve, reject) => {
    setTimeout(() => resolve(), time);
  });
}

/**
 * 上传截图
 * @param {String} path 文件路径
 * @param {String} name 文件名称
 */
function save(path, name) {
  const qiniu = require('qiniu');
  const accessKey = 'wisuIrzD_dQi2DlKXQukwYZn7PRxXLMWaT_CA8YS';
  const secretKey = '-q9oNpJn_urnxTfVVSiwCAk-1oPArbTZ1ISlkYxH';
  const mac = new qiniu.auth.digest.Mac(accessKey, secretKey);
  const options = {
    scope: 'zzestlgc',
    returnBody: '{"key":"$(key)","hash":"$(etag)","fsize":$(fsize),"bucket":"$(bucket)","name":"$(x:name)"}',
  };

  const putPolicy = new qiniu.rs.PutPolicy(options);
  const uploadToken = putPolicy.uploadToken(mac);

  const config = new qiniu.conf.Config();
  // 空间对应的机房
  config.zone = qiniu.zone.Zone_z2;

  const formUploader = new qiniu.form_up.FormUploader(config);
  const putExtra = new qiniu.form_up.PutExtra();
  const key = name;

  formUploader.putFile(uploadToken, key, path, putExtra, (err, body, info) => {
    if (err) throw err;
    if (info.statusCode === 200) {
      console.log(body);
    } else {
      console.log(info.statusCode);
      console.log(body);
    }
  });
}

module.exports = SpiderArticle;
