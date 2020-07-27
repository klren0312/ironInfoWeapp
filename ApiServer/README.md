# 普钢管理后台API服务

## 一、系统环境介绍

 - NodeJS
 - MySQL
 - Redis (12 - 订单, 4 - wechat, 5 - toutiao, 6 - qrcode login)

### 1.NodeJS
JS服务端运行环境

*参考资料:*

 - 

 - [NVM, NodeJS版本管理](https://github.com/nvm-sh/nvm)
 - [EggJS官方网站](https://eggjs.org/)
 - [治电EggJS开发规范](https://github.com/klren0312/ironInfoWeapp/blob/master/doc/EggJSDevelop.md)

### 2.MySQL数据库
开源关系型数据库

*参考资料:*

 - 

 -  [CentOS 7.x 安装 MySQL](https://www.jianshu.com/p/3b613d4491bf)
 -  [Centos 7 备份MySQL/MongoDB并发邮件脚本](https://www.jianshu.com/p/a366c293387f)

### 3.Redis
开源、支持网络、基于内存、可选持久性的键值对存储数据库

*参考资料:*

 - [Centos 7下使用yum安装redis](https://www.jianshu.com/p/ebda253a8daa)

---

## 二、EggJS 相关插件

 - egg-sequelize
 - egg-redis
 - egg-jwt
 - egg-router-plus
 - egg-validate
 - egg-cors
 - egg-view-nunjucks
 - egg-zrole

### 1.egg-sequelize
Sequelize的EggJS插件. Sequelize是MySQL的ORM框架

*参考资料:*

 - [egg-sequelize插件地址](https://github.com/eggjs/egg-sequelize)
 - [Sequelize官方文档](https://sequelize.org/)


### 2.egg-redis
Redis的EggJS插件

*参考资料:*

 - [egg-redis插件地址](https://github.com/eggjs/egg-redis)


### 3.egg-jwt
EggJS的JWT插件

*参考资料:*

 - [egg-jwt插件地址](https://github.com/okoala/egg-jwt)


### 4.egg-router-plus
EggJS的路由加强插件, 主要用于给路由统一添加前缀

*参考资料:*

 - [egg-router-plus插件地址](https://github.com/eggjs/egg-router-plus)


### 5.egg-validate
EggJS的参数校验插件

*参考资料:*

 - [egg-validate插件地址](https://github.com/eggjs/egg-validate)


### 6.egg-cors
EggJS的访问控制插件

*参考资料:*

 - [egg-cors插件地址](https://github.com/eggjs/egg-cors)


### 7.egg-view-nunjucks
EggJS的模板渲染引擎插件, 语法类似 Django 的 jinjia

*参考资料:*

 - [egg-view-nunjucks插件地址](https://github.com/eggjs/egg-view-nunjucks)
 - [nunjucks文档](http://mozilla.github.io/nunjucks/)


### 8.egg-zrole
EggJS的基于Casbin的权限控制插件

*参考资料:*

 - [egg-zrole插件地址](https://github.com/klren0312/egg-zrole)
 - [Casbin官方网站](https://casbin.org/)

---

## 三、项目目录
```
.
├── app.js
├── server.js
├── app
│   ├── router.js 
│   ├── controller            
│   ├── extend           
│   ├── middleware
│   ├── service
│   ├── public
│   ├── view
│   ├── router
│   └── model （自建Sequelize目录）
└──  config
    ├── plugin.js
    ├── config.default.js
    └── config.prod.js
```
以上目录介绍如下：
1. app/router.js 用于配置URL路由规则。
2. app/controller/ 用于解析用户输入，处理后返回响应结果。
3. app/extend/ 用于框架内部对象的拓展(request,response,context,application)和工具类(helper)的编写。
4. app/middleware/ 用于编写中间件。
5. app/service/ 用于编写业务逻辑，如数据库操作的封装，api请求的封装等。
6. app/public/ 用于放置静态文件。
7. app/view/ 用于放置模板文件。
8. app/model/ 用于放置数据模型。
9. app/router/ 用户放置分离的路由
10. app.js 用于自定义启动时的初始化工作。
11. server.js 用于使用pm2部署 `pm2 start server.js`


---

## 四、相关业务逻辑
### 1.分页逻辑
分页中间件, 获取分页及其他查询参数
```javascript
module.exports = async (ctx, next) => {
  const { query } = ctx.request

  ctx.validate({
    pageField: { type: 'string', required: false },
    pageSort: { type: 'enum', values: ['ASC', 'DESC'], required: false },
    pageSize: { type: 'string', format: /\d+/, required: false },
    pageIndex: { type: 'string', format: /\d+/, required: false },
  }, query)

  const {
    pageField = 'updated_at',
    pageSort = 'DESC',
  } = query
  // ~~ 用于 Math.floor 的功能, 以及将 undefined, null 转为数字 0
  const pageSize = ~~query.pageSize || 20
  const pageIndex = ~~query.pageIndex || 1

  ctx.page = { pageField, pageSort, pageSize, pageIndex }

  return next()
}
```

求和服务, 获取列表总数
```javascript
async findCount({ modelName, where = {} }) {
  return this.ctx.model[modelName].count({
    where
  })
}
```

根据查询参数获取列表数据
```javascript
async findPage({
  modelName,
  where = {},
  page,
  attributes = {},
  include = [],
}) {
  const {
    pagination
  } = this.ctx.helper
  const {
    order,
    offset,
    limit
  } = pagination(page)
  return this.ctx.model[modelName].findAll({
    where,
    order,
    offset,
    limit,
    attributes,
    include,
  })
}
```

*示例*
1.controller, 获取用户日志
```javascript
async getUserLog() {
  const { ctx, app } = this
  let { page } = ctx
  const { common } = ctx.service.v1
  console.log(page)
  page = {
    ...page,
    pageField: 'id',
    pageSort: 'DESC'
  }
  const [total, items] = await Promise.all([
    common.findCount({ modelName: 'Log' }),
    common.findPage({ modelName: 'Log', page }),
  ])
  const res = { total, items, pageSize: page.pageSize, pageIndex: page.pageIndex }
  ctx.helper.success({ ctx, res: res })
}
```

2.配置路由, 引入分页中间件
```javascript
apiV1Router.get('/log', app.jwt, middleware.pagination, controller.api.user.getUserLog)
```

### 2.文件上传
1.后端controller
```javascript
class UploadController extends Controller {
  async index() {
    const { ctx } = this
    const stream = await ctx.getFileStream()
    ctx.helper.success({ctx, res: 'upload ok' + stream})
  }
}
```

2.前端上传文件
```html
<label for="file">upload</label>
<input type="file" id="file">
<script>
  var file = document.querySelector('#file')
  file.addEventListener('change', function(e) {
    var f = e.target.files[0]
    var formdata = new FormData()
    formdata.append('file', f)
    console.log(formdata)
    fetch(`http://localhost:7001/upload`, {
      method: 'POST',
      body: formdata
    })
      .then(res => res.json())
      .then(res => {
        e.target.value = null
        console.log(res.data)
      })
  })
</script>
```

### 3.小程序登录
https://www.jianshu.com/p/8df2213f6f9d

### 4.小程序统计数据获取
由于请求获取`access_token`的次数有限制, 所以将其存入`redis`中缓存
```javascript
async getWechatToken() {
  const {ctx, app} = this
  let result = await ctx.helper.request({ctx, url: `https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${app.config.wechat.tlgc.appId}&secret=${app.config.wechat.tlgc.secret}`})
  app.redis.set('weToken', result.data.access_token, 'EX', result.data.expires_in)
  return result.data.access_token
}
```

使用`access_token`请求获取前一天的用户画像
**注意: 在零点前后数据会获取不到**
```javascript
async getWechatUser() {
  const {ctx, app} = this
  const yesterday = dayjs().subtract(1, 'day').format("YYYYMMDD")
  let token = await app.redis.get('token');
  if(token && token !== '') {
    const result = await ctx.helper.request({
      ctx, 
      url: `https://api.weixin.qq.com/datacube/getweanalysisappiduserportrait?access_token=${token}`,
      method: 'POST',
      data: {
        begin_date: yesterday,
        end_date: yesterday
      }
    })
    return result
  } else {
    token = await ctx.service.v1.data.getWechatToken()
    const result = await ctx.helper.request({
      ctx, 
      url: `https://api.weixin.qq.com/datacube/getweanalysisappiduserportrait?access_token=${token}`,
      method: 'POST',
      data: {
        begin_date: yesterday,
        end_date: yesterday
      }
    })
    return result
  }
}
```

### 5.热门钢材排序
按照新的顺序, 遍历数据库中热门钢材的sort字段

```javascript
async setSortById(list) {
  let arr = []
  list.forEach(v => {
    arr.push(this.ctx.model.Hot.update(
      {sort: v.sort},
      {
        where: {
          id: v.id
        }
      }
    ))
  })
  const result = await Promise.all(arr)
  if(Array.isArray(result) && result.length > 0) {
    return true
  } else {
    return false
  }
}
```

### 6.HTTP请求封装
```javascript
request: async ({ctx, method = 'GET', url='', data = {}}) => {
  const result = await ctx.curl(url, {
    method: method,
    contentType: 'json',
    dataType: 'json',
    data: data
  })
  return result
}
```

### 7.响应体封装
```javascript
/**
 * 错误码
 */
errorCode: {
  200: '服务器成功返回请求的数据。',
  201: '新建或修改数据成功。',
  202: '一个请求已经进入后台排队（异步任务）。',
  204: '删除数据成功。',
  400: '发出的请求有错误，服务器没有进行新建或修改数据的操作。',
  401: '用户没有权限（令牌、用户名、密码错误）。',
  403: '用户得到授权，但是访问是被禁止的。',
  404: '发出的请求针对的是不存在的记录，服务器没有进行操作。',
  406: '请求的格式不可得。',
  410: '请求的资源被永久删除，且不会再得到的。',
  422: '当创建一个对象时，发生一个验证错误。',
  500: '服务器发生错误，请检查服务器。',
  502: '网关错误。',
  503: '服务不可用，服务器暂时过载或维护。',
  504: '网关超时。'
}

/**
 * 处理成功请求后的响应
 */
success: ({ ctx, code = 200, res = {}, msg }) => {
  if (!res) code = 404
  ctx.status = 200
  ctx.body = {
    code: code,
    message: msg || ctx.helper.errorCode[code],
    data: res
  }
}

/**
 * 处理失败请求后的响应
 */
fail: ({ ctx, code = 500, res = {}, msg }) => {
  ctx.status = 200
  ctx.body = {
    code: code,
    message: msg || ctx.helper.errorCode[code],
    data: res
  }
}
```

### 8.数据库初始化
1. 第一次启动, 取消掉`app.js`中注释即可
```javascript
'use strict';

module.exports = app => {
  if (app.config.env === 'local') {
    app.beforeStart(async () => {
      await app.model.sync({ force: true })
    })
  }
}
```

2. 之后注释掉
```javascript
await app.model.sync({ force: true })
```

3. 另一种迁移方法
```bash
npm run mrigate:up
```

4. 初始化管理员账号
```bash
npm run create-user
```

 - 用户名: admin
 - 密码: admin


---

## 五、运行
```bash
$ npm install  /   yarn
$ npm run dev  /   yarn dev
```

---

## 六、部署
```bash
$ npm run start /  yarn start
```

## 七、相关模块安装

相关中文字体安装, 用于爬虫

```shell
yum install wqy-unibit-fonts.noarch wqy-zenhei-fonts.noarch -y
```


