'use strict';

const Service = require('egg').Service;
const {
  Wechaty,
  Message,
} = require('wechaty');
const WECHAT_API = 'https://api.qrserver.com/v1/create-qr-code/?data=';

class WechatService extends Service {
  constructor(app) {
    super(app);
    this.userId = this.app.verifyToken(this.ctx).id;
    const data = this.app.wechatQueue[this.userId] || {};
    this.bot = data.source;
    this.ctx.logger.info(`bot: ${this.bot}, source: ${data.source}, userId: ${this.userId}`);
    this.status = data.status;
  }
  /**
   * 用户登入
   */
  async login() {
    return new Promise((reslove, reject) => {
      const bot = new Wechaty({
        name: `${this.userId}Robot`,
      });

      bot.on('scan', (qrcode, status) => reslove(WECHAT_API + qrcode));
      bot.on('login', user => {
        this.app.wechatQueue[this.userId] = {
          source: bot,
          status: 1,
        };
      });
      bot.on('logout', user => {
        this.app.wechatQueue[this.userId] = null;
        delete this.app.wechatQueue[this.userId];
      });
      bot.on('error', e => console.error(e));
      bot.start().catch(console.error);
    });
  }
  /**
   *
   */
  async logout() {
    if (!this.checkLogin()) return false;
    const res = await this.bot.logout();
    return res;
  }
  /**
   * 获取全部的朋友
   * @param {*} query  查询条件
   */
  async friends(query) {
    if (!this.checkLogin()) return false;
    const contactList = await this.bot.Contact.findAll();
    return this.filterContacts(contactList || [], query);
  }

  /**
   * 获取全部群聊
   * @param {*} topic 群聊名
   */
  async rooms({ topic }) {
    if (!this.checkLogin()) return false;
    const roomList = await this.bot.Room.findAll();
    return roomList.filter(item => {
      return topic ? item.payload.topic.indexOf(topic) >= 0 : true;
    });
  }

  /**
   * 获取群聊里的人员
   * @param {*} query {topic：群聊名}
   * name：名字
   * roomAlias：群聊别名
   * contactAlias：联系人别名
   * friend : 1是朋友 2不是朋友
   * type : 1个人   2 公众号  3 未知
   */
  async RoomMembers(query) {
    if (!this.checkLogin()) return false;
    if (query.topic) {
      const room = await this.rooms({ topic: query.topic });
      if (room.length > 0) {
        let members;
        if (query.name) {
          members = await room[0].memberAll({ name: new RegExp(query.name) });
        } else if (query.roomAlias) {
          members = await room[0].memberAll({ roomAlias: query.roomAlias });
        } else if (query.contactAlias) {
          members = await room[0].memberAll({ contactAlias: query.contactAlias });
        } else {
          members = await room[0].memberAll();
        }
        return this.filterContacts(members || [], { friend: query.friend, type: query.type });
      }
    }
    return [];
  }
  /**
   * 批量添加好友 (只有wxid非wxid_开头的才可以正常添加。)
   * @param {*} query
   */
  async RoomMembersAdd(query) {
    if (!this.checkLogin()) return false;
    const members = await this.RoomMembers(query);
    this.app.wechatAddContactQueue.push({ key: this.userId, bot: this.app.wechatQueue[this.userId], data: members });
    this.app.runSchedule('wehcat_add_contact');
  }
  /**
   * 导出
   * @param {*} query
   */
  async export(query) {
    if (!this.checkLogin()) return false;
    const data = await this.friends(query);
    const arr = data.map(function(item) {
      // const file = await item.avatar()
      // let avatar = await file.toBase64(file.name, true);
      const payload = item.payload;
      return {
        id: payload.id,
        名字: payload.name,
        性别: payload.gender === 0 ? '无' : (payload.gender === 1 ? '男' : '女'),
        别名: payload.alias,
        朋友: payload.friend ? '是' : '否',
        星标: payload.star ? '是' : '否',
        类型: payload.type === 1 ? '个人' : (payload.type === 2 ? '公众号' : '未知'),
        描述: payload.signature,
        省份: payload.province,
        城市: payload.city,
        地址: payload.address,
      };
    });
    return arr;
  }
  // 检查是否登录
  checkLogin() {
    const { ctx, bot, status } = this;
    console.log(bot, status);
    if (!bot && status !== 1) {
      return false;
    }
    return true;
  }
  // 过滤联系人
  /**
 * @param {*} param1
 * name：名字
 * alias：别名
 * friend : 1是朋友 2不是朋友
 * type : 1个人   2 公众号  3 未知
 * gender : 1 男  2  女
 * province : 省份
 * city ：城市
 * address：地址
 */
  filterContacts(contacts, query) {
    const { name, alias, friend, type, gender, province, city, address } = query;
    return contacts.filter(item => {
      const arr = [];
      const { payload } = item;
      if (friend != undefined) {
        const bool = Number(friend) === 1;
        arr.push(bool === payload.friend);
      }
      name && arr.push(payload.name.indexOf(name) >= 0);
      alias && arr.push(payload.alias.indexOf(alias) >= 0);
      type && arr.push(Number(type) === payload.type);
      gender && arr.push(Number(gender) === payload.gender);
      province && arr.push(payload.province.indexOf(province) >= 0);
      city && arr.push(payload.city.indexOf(city) >= 0);
      address && arr.push(payload.address.indexOf(address) >= 0);
      return arr.indexOf(false) < 0;
    });
  }
}

module.exports = WechatService;
