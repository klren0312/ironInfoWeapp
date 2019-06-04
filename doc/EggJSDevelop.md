# EggJS开发规范


## 修订版本
|当前版本号|	修订人 |	修订日期|	修订描述|
| :------: | :------: | :------: | :------: |
|0.1|	任治中 |	2018/05/14 |	项目规范，编码规范，RESTful API规范 |
|0.2|	任治中 |	2018/05/15 |	项目规范中，Sequelize，redis,Socket.IO;RESTful API规范中状态码修改，添加过滤、排序、分页格式|
|0.3|	任治中 |	2018/05/16 |	项目规范中，helper中错误码定义，模板渲染，增加Controller，middleware，Service相关，git规范|
|0.4|	任治中 |	2018/05/17 |	项目规范中，数据库配置|
|0.5|	任治中 |	2018/05/18 |	修改格式，修改错误，git提交格式改用git cz工具|
|0.6|	任治中 |	2018/05/21 |	修改router格式，使用各个模块路由分离|
|0.7|	任治中 |	2018/06/05 |	模板开发|
|1.0|	任治中 |	2019/02/06 |	分页格式修改|

# 1.编码规范
## 1.1 编码格式与语法
项目默认编码格式统一为UTF-8格式，语法采用ES6+语法
## 1.2 代码注释
注释符号后要有一个空格
### 1.2.1 函数/方法注释
函数/方法注释放置于函数/方法的上方，主要描述函数/方法功能以及参数类型，参数和返回值说明
```javascript
/**
 * 功能
 * @param  {参数类型} 参数名 参数说明
 * @return {返回值类型} 返回值 返回值说明
 */
```
### 1.2.2 单行注释
对代码做简要说明
// 功能简要说明
## 1.3 代码分段及缩进
每段代码应放在一个代码块中。块内的代码都应该统一地缩进一个单位。
### 1.3.1 使用空格作为缩进
使用2个空格作为一个缩进单位。
### 1.3.2 代码块符号
代码块的开始符号要放在行尾，不可单独一行；代码块结束符号要单独一行。
```javascript
function demo() { // 代码块开始符号
  // ...
} // 代码块结束符号
```
## 1.4 空白行分隔
不同功能或多个代码块之间，使用空白行分隔
```javascript
/**
 * 方法1
 */
function demo1() {

} 

/**
 * 方法2
 */
function demo1() {
  ...... // 代码块1

  ...... // 代码块2
} 
```
## 1.5 命名规则
全部使用英文单词
### 1.5.1 文件命名
 - 控制器，模型，服务的文件名使用小写名词。
 - 中间件使用下划线分割命名。
 - 使用中间件使用将下划线命名改为首字母小写的驼峰命名。
 - 控制器，服务的类名为首字母大写的文件名+Controller。
### 1.5.2 变量与常量命名
尽量使用const代替let
若变量需要改变才使用let
固定常量为全大写，其余使用首字母小写的驼峰命名法
### 1.5.3 函数/方法命名
使用首字母小写的驼峰命名
## 1.6 引号
一般情况使用单引号，若字符串拼接，使用"``"和"${}"
## 1.7 分号
不用分号
# 2.项目规范
库的安装和项目的初始化全部使用yarn
## 2.1 项目生成
$ npm install -g yarn egg-init
$ egg-init 项目名 --type=simple
$ cd 项目名 
$ yarn install
## 2.2 安装第三方库
$ yarn add 库名
## 2.3 项目运行
### 2.3.1 项目开发运行
$ yarn dev
### 2.3.2 项目部署运行
$ yarn start
### 2.3.3 项目docker运行
向package.json中的scripts键添加一个值
```json
"scripts": {
  ......
  "docker": "egg-sequelize db:migrate && egg-scripts start",
  ......
}
```
## 2.4 项目目录
```
.
├── app.js
├── app
│   ├── router.js 
│   ├── controller            
│   ├── extend           
│   ├── middleware
│   ├── service
│   ├── public
│   ├── view
│   ├── router
│   ├── io     (自建socket.io目录)
│   │   ├── middleware
│   │   └── controller
│   └── model （自建Sequelize目录）
├── config
│   ├── plugin.js
│   ├── config.default.js
│   └── config.prod.js
├── migrations（自建Sequelize目录）
├── logs
└── test
    └── app
        ├── middleware
        └── controller
```
以上目录约定如下：
1. app/router.js 用于配置URL路由规则。
2. app/controller/ 用于解析用户输入，处理后返回响应结果。
3. app/extend/ 用于框架内部对象的拓展(request,response,context,application)和工具类(helper)的编写。
4. app/middleware/ 用于编写中间件。
5. app/service/ 用于编写业务逻辑，如数据库操作的封装，api请求的封装等。
6. app/public/ 用于放置静态文件。
7. app/view/ 用于放置模板文件（可能不需要）。
8. app/model/ 用于放置数据模型（若使用Sequelize）。
9. app/router/ 用户放置分离的路由
10. migrations/ 用与放置数据库迁移的文件。
11. logs/ 日志存放目录。
12. test/ 测试文件目录。
13. app.js 用于自定义启动时的初始化工作。

## 2.5 项目相关文件说明
所有代码均在'use strict'严格模式下开发

### 2.5.1 extend
>包含四个对象对应的文件，以及一个helper工具类

1.代码格式
```javascript
'use strict'

module.exports = {
  /**
   * 方法说明
   * @param {参数类型} 参数名 参数说明
   * @return {返回值类型} 返回值名 返回值说明
   */
  方法名(参数) {
    // 处理逻辑
    return 返回值
  },
  get 属性名() {
    // 属性相关逻辑
    return 属性
  },
  set 属性名(值) {
    this.set(键, 值)
  },
}
```
2.application.js
>对应Application对象

访问方式：

 - ctx.app
 - Controller, Middleware, Helper, Service中都能使用this.app访问，例如this.app.config访问配置对象
 - 将app对象作为函数的第一个参数注入 module.exports = app => {}

3.context.js
>对应context对象

访问方式：

 - middleware中this就是 ctx
 - controller中使用this.ctx访问
 - helper,service中使用this.ctx访问

4.request.js
>对应request.js对象

访问方式：
 - ctx.request
相关方法：

 - ctx.request.body 获取客户端请求的body参数
 - ctx.request.headers 获取客户端请求的header
 - ctx.request.query/ctx.query 获取URL内的参数
 - ctx.request.params 获取路由配置的参数

5.response.js
>对应response.js对象

访问方式：
 - ctx.response
相关方法：

 - ctx.response.body/ctx.body 响应给客户端的body参数

6.helper.js
>工具类，将请求成功和请求失败返回封装的函数以及错误码的封装写到里面

访问方式：
 - ctx.helper
 - 若要在非请求状态下，调用ctx，比如service中使用ctx.helper，则使用以下方法
```javascript
const { app } = this.ctx;
const ctx = app.createAnonymousContext();
ctx.helper.ROOTURL //此变量即可调用
```
封装状态码，将其解释写在helper里，方便调用
```javascript
module.exports = {
  errorCode: {
    200: '请求成功。客户端向服务器请求数据，服务器返回相关数据',
    201: '资源创建成功。客户端向服务器提供数据，服务器创建资源',
    202: '请求被接收。但处理尚未完成',
    204: '客户端告知服务器删除一个资源，服务器移除它',
    206: '请求成功。但是只有部分回应',
    400: '请求无效。数据不正确，请重试',
    401: '请求没有权限。缺少API token，无效或者超时',
    403: '用户得到授权，但是访问是被禁止的。',
    404: '发出的请求针对的是不存在的记录，服务器没有进行操作。',
    406: '请求失败。请求头部不一致，请重试',
    410: '请求的资源被永久删除，且不会再得到的。',
    422: '请求失败。请验证参数',
    500: '服务器发生错误，请检查服务器。',
    502: '网关错误。',
    503: '服务不可用，服务器暂时过载或维护。',
    504: '网关超时。',
  }
}
```
在Controller中响应客户端时,使用
```
this.ctx.body = {
  code: 400,
  message: this.ctx.helper.errorCode[400],
  data:{
    error:'err'
  }
}
```
封装请求成功的方法
```
module.exports= { 
  success: ({ ctx, code=200, res=null }) => {
    ctx.status = 200
    ctx.body = {
      code: code,
      message: ctx.helper.errorCode[code],
      data: res
    }
  }
}
```
封装请求失败的方法
```
module.exports = {
  fail: ({ ctx, code=500, res=null }) => {
    ctx.status = 200
    ctx.body = {
      code: code,
      message: ctx.helper.errorCode[code],
      data: {
        error: res
      }
    }
  }
}
```
请求封装使用例子
```
ctx.helper.success({ ctx, code:200, res:'success' })
ctx.helper.fail({ ctx, code:500, res:'fail' })
```

### 2.5.2 配置文件
1.plugin.js
>引入第三方插件

代码格式：
```javascript
exports.插件名 = {
  enable: true,
  package: '库名'
}
```
例如：
```javascript
exports.jwt = {
  enable: true,
  package: 'egg-jwt'
}
```

2.config.{{env}}.js 
访问方式：

 - this.app.config
 - this.config

代码格式：
```javascript
'use strict'

module.exports = appInfo => {
  const config = exports = {}
  // 全局变量
  config.变量名=''
  // 插件名
  config.插件名= {
    // 相关配置
  }
}
```
例如：
```javascript
'use strict'

module.exports = appInfo => {
  const config = exports = {}
  // redis 配置
  config.redis = {
    client: {
      port: process.env.RS_PORT || 6379,
      host: process.env.RS_HOST || '0.0.0.0',
      password: process.env.RS_PASSWORD || '',
      db: 0,
    }
  }
}
```

 - 默认配置放置在config.default.js,所有环境都会加载
 - 本地环境使用config.local.js
 - 开发环境使用config.prod.js

2.5.3 Middleware
>中间件。对于一些错误拦截，请求处理，需要使用中间件完成。

配置方法：
 - 文件名命名使用下划线分割，在config.{{env}}.js文件中的middleware中配置，使用的是驼峰方式配置
例如：中间件文件名为demo-middleware 在config.{{env}}.js中的配置
```javascript 
config.middleware = ['demoMiddleware']
```
 - 在路由中配置，同样使用中间件时名称使用驼峰方式
例如：
```javascript
module.exports = app => {
  const demo = app.middleware.demoMiddleware()
  app.router.get('/url', demo, app.controller.demo)
}
```
代码格式：
```javascript
'use strict'

module.exports = () => {
  return async function 方法名(ctx, next) {
    await next()
    // 相关逻辑
  }
}
```
例如：
```javascript
'use strict'

module.exports = () => {
  return async function notFoundHandler(ctx, next) {
    await next()
    if (ctx.status === 404 && !ctx.body) {
      ctx.body = { error: 'Not Found' }
    }
  }
}
```
处理错误信息的中间件
```javascript
'use strict'

module.exports = (option, app) => {
  return async function(ctx, next) {
    try {
      await next()
    } catch (err) {
      app.emit('error', err, this)
      const status = err.status || 500
      // 生产环境下不将错误内容返回给客户端
      const error = status === 500 && app.config.env === 'prod'
        ? '服务器错误，请联系管理员！'
        : err.message
      ctx.helper.fail({ctx, code:status, res:error})
      if(status === 422) {
        ctx.helper.fail({ctx, code:status, res:err.errors})
      }
    }
  }
}
```

### 2.5.4 Service
>保持Controller中逻辑简洁，以及业务逻辑的独立性，抽象出的Service可以被多个Controller调用。比如封装数据库操作的方法，API请求封装，第三方服务调用等。

访问方式：

 - this.service
Service支持多级目录，访问的时候可以通过目录名级联访问
 - app/service/biz/user.js => ctx.service.biz.user
 - app/service/sync_user.js => ctx.service.syncUser
 - app/service/HackerNews.js => ctx.service.hackerNews
代码格式（类的方式）：
 - 类名使用首字母大写的驼峰命名法
 - 获取ctx,app,service,config,logger等对象使用const {对象} = this的方式获取

```javascript
'use strict'

const Service = require('egg').Service

class 类名 extends Service {
  /**
   * 方法说明
   * @param {参数类型} 参数名 参数说明
   * @return {返回值类型} 返回值名 返回值说明
   */
  async 方法名(参数名) {
    // 方法逻辑
    return 返回值
  }
}
```
方法例子如下：
```javascript
/**
 * 添加礼物
 * @param {string} livecode 编号
 * @return {int} giftnum 礼物数量
 */
async addGift(livecode) {
  const { app }  = this
  const giftnum = await this.ctx.model.query(`UPDATE live SET gift=gift+1 WHERE livecode='${livecode}'`)
  return giftnum
}
```
### 2.5.5 Controller
>三种功能，处理restful接口用户传来的参数；模板渲染；请求代理

访问方式：

 - 可以支持多级目录，访问的时候可以通过目录名级联访问
例如：
 - app.controller.post.create() // 代码放在 app/controller/post.js
 - app.controller.sub.post.create() // 代码放在 app/controller/sub/post.js
代码格式（类的方式）：
 - 命名使用文件名首字母大写+Controller
 - 获取ctx,app,service,config,logger等对象使用const {对象} = this的方式获取

```javascript
'use strict'

const Controller = require('egg').Controller

class 首字母大写的文件名+Controller extends Controller {
  async 方法名() {
    // 相关逻辑
    ctx.body = {
      // 返回给restful api接口的请求者
    }
  }
}
```
例如：
```javascript
'use strict'

const Controller = require('egg').Controller

class HomeController extends Controller {
  async index() {
    const {ctx} = this
    if(ctx.isAuthenticated) {
      ctx.body = {
        user: ctx.user
      }
    } else {
      ctx.body = {
        user: 'fail'
      }
    }
  }
}
module.exports = HomeController
```
### 2.5.6 router.js路由文件
>描述请求的URL与controller建立的联系。将各个路由分离开来，分别放入router文件夹，并在router.js中引入

代码格式：
```javascript
'use strict'

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app
  router.操作('/URL路径', 中间件1, ...中间件n, controller.文件名.方法) 
}
```
例如：
```javascript
'use strict'

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app
  const roleCheck = app.middleware.roleCheck()
  router.get('/user', app.jwt, roleCheck, controller.user.getAllUser)
}
```
带参路由，两种形式，以及获取参数的方式：

1. 使用形如/uri/:id的uri，在Controller中使用ctx.request.params获取 例如：
```javascript
// router.js
router.get('/user/:id', controller.user.info)

// controller
const { ctx } = this
const { id } = ctx.request.params
```
2. 使用形如/uri?id=1&age=1的uri，在Controller中使用ctx.query获取 例如：
```javascript
// router.js
router.get('/user?id=1&age=1', controller.user.msg)

// controller
const { ctx } = this
const { id, age } = ctx.query
```

## 2.6 安全配置
>开发的时候关闭csrf，防止无法请求接口

```javascript
// csrf关闭
config.security = {
  csrf: {
    enable: false
  }
}
```
## 2.7 Sequelize
### 2.7.1 安装
```bash
$ yarn add egg-sequelize mysql2
```
### 2.7.2 启用与配置
>在plugin.js中启用Sequlize

```javascript
exports.sequelize = {
  enable: true,
  package: 'egg-sequelize'
}
```
在config.{{env}}.js中配置数据库连接.账户相关的信息，开发状态下将信息填入config.local.js；部署环境下，将信息填入config.prod.js
```javascript
config.sequelize = {
  dialect: 'mysql',
  database: process.env.DB_DATABASE || '数据库名',
  host: process.env.DB_HOST || 'IP地址',
  port: process.env.DB_PORT || '数据库端口号',
  username: process.env.DB_USER || '数据库用户名',
  password: process.env.DB_PASSWORD || '数据库密码',
  timezone: '+08:00'
}
```
在package.json中配置数据库迁移命令
```javascript
"scripts": {
  ...
  "migrate:new": "egg-sequelize migration:create",
  "migrate:up": "egg-sequelize db:migrate",
  "migrate:down": "egg-sequelize db:migrate:undo"
}
```
开发过程中配置自动同步数据库（仅开发模式）,在app.js中写入
```javascript
module.exports = app => {
  if(app.config.env === 'local') {
    app.beforeStart(async () => {
      await app.model.sync({force:true})
    })
  }
}
```
### 2.7.3 model数据模型开发
>文档参考：https://demopark.github.io/sequelize-docs-Zh-CN/models-definition.html

 - 文件名为表名
 - 在文件前面引入需要的字段类型const {类型} = Sequelize

代码格式：
```javascript
'use strict'

module.exports = app => {
  const {类型} = app.Sequelize
  const 首字母大写的表名 = app.model.define('表名', {
    字段名: {
      type: 类型,
      // 其他属性
      // 是否是唯一
      unique: true,
      // 定义主键
      primaryKey: true,
      // 自增
      autoIncrement: true,
      // 校验
      validate: {
        is: ["^[a-z]+$",'i'],     // 只允许字母
        is: /^[a-z]+$/i,          // 与上一个示例相同,使用了真正的正则表达式
        not: ["[a-z]",'i'],       // 不允许字母
        isEmail: true,            // 检查邮件格式 (foo@bar.com)
        isUrl: true,              // 检查连接格式 (http://foo.com)
        isIP: true,               // 检查 IPv4 (129.89.23.1) 或 IPv6 格式
        isIPv4: true,             // 检查 IPv4 (129.89.23.1) 格式
        isIPv6: true,             // 检查 IPv6 格式
        isAlpha: true,            // 只允许字母
        isAlphanumeric: true,     // 只允许使用字母数字
        isNumeric: true,          // 只允许数字
        isInt: true,              // 检查是否为有效整数
        isFloat: true,            // 检查是否为有效浮点数
        isDecimal: true,          // 检查是否为任意数字
        isLowercase: true,        // 检查是否为小写
        isUppercase: true,        // 检查是否为大写
        notNull: true,            // 不允许为空
        isNull: true,             // 只允许为空
        notEmpty: true,           // 不允许空字符串
        equals: 'specific value', // 只允许一个特定值
        contains: 'foo',          // 检查是否包含特定的子字符串
        notIn: [['foo', 'bar']],  // 检查是否值不是其中之一
        isIn: [['foo', 'bar']],   // 检查是否值是其中之一
        notContains: 'bar',       // 不允许包含特定的子字符串
        len: [2,10],              // 只允许长度在2到10之间的值
        isUUID: 4,                // 只允许uuids
        isDate: true,             // 只允许日期字符串
        isAfter: "2011-11-05",    // 只允许在特定日期之后的日期字符串
        isBefore: "2011-11-05",   // 只允许在特定日期之前的日期字符串
        max: 23,                  // 只允许值 <= 23
        min: 23,                  // 只允许值 >= 23
        isCreditCard: true,       // 检查有效的信用卡号码

        // 也可以自定义验证:
        isEven(value) {
          if (parseInt(value) % 2 != 0) {
            throw new Error('Only even values are allowed!')
            // 我们也在模型的上下文中，所以如果它存在的话, 
            // this.otherField会得到otherField的值。
          }
        }
      }
    }
  },{
    // 配置表名 
    tableName: '表名', 

    // 不添加时间戳属性 (updatedAt, createdAt)
    timestamps: true,

    // 不删除数据库条目，但将新添加的属性deletedAt设置为当前日期（删除完成时）。 
    // paranoid 只有在启用时间戳时才能工作
    paranoid: true,

    // 不使用驼峰样式自动添加属性，而是下划线样式，因此updatedAt将变为updated_at
    underscored: true,

    // 禁用修改表名; 默认情况下，sequelize将自动将所有传递的模型名称（define的第一个参数）转换为复数。 如果你不想这样，请设置以下内容
    freezeTableName: true,

    // 不使用createdAt
    createdAt: false,

    // 我想 updateAt 实际上被称为 updateTimestamp
    updatedAt: 'updateTimestamp',

  })
  首字母大写的表名.associate = function() {
    // 表关联
  }
  return 首字母大写的表名
}
```
例如：
```javascript
'use strict'

module.exports = app => {
  const {STRING} = app.Sequelize
  const Role = app.model.define('role', {
    name: {
      type: STRING,
      unique: true,
      allowNull: false
    }
  }, {
    timestamps: true, 
    tableName: 'role',
    underscored: false
  })
  Role.associate = function() {
    app.model.Role.hasMany(app.model.UserRole)
  }
  return Role
}
```
### 2.7.4 migrations的使用

 - 使用yarn migrate:new生成初始化文件。
 - 将需要生成的表中的字段填入文件的up方法里，在down中填入删除表的方法。
 - 若需生成数据表，则使用yarn migrate:up。
 - 若需要删除数据表，则使用yarn migrate:down。
 - migrations文件命名为'时间+表名.js'。
 - 数据库迁移中要在up方法中要添加id字段、时间字段createAt和updateAt。

### 2.7.5 操作数据库
>一般在Service中进行数据库操作，常用方法有findOne, findAll, create, destory, update等。文档参考：https://demopark.github.io/sequelize-docs-Zh-CN/models-usage.html

例子：
```javascript
const result = await this.ctx.service.role.create({
  name: name
})
```
## 2.8 Redis
### 2.8.1 安装
```bash
$ yarn add egg-redis
```
### 2.8.2 启用与配置
>在plugin.js中启用Sequlize

```javascript
exports.redis = {
  enable: true,
  package: 'egg-redis'
}
```
在config.{{env}}.js中配置数据库连接
```javascript
config.redis = {
  client: {
    port: process.env.RS_PORT || 'Redis主机端口号',
    host: process.env.RS_HOST || 'Redis主机地址',
    password: process.env.RS_PASSWORD || '',
    db: '缓存数据库名称',
  }
}
```
### 2.8.3 使用方法
>具体方法和redis原生方法基本一致，原生api地址：https://www.cheatography.com/tasjaevan/
cheat-sheets/redis/

调用方法：

 - app.redis

常用方法：

 - app.redis.expire(键名, 时间) 设置键的失效时间
 - app.redis.lpush(键名, 值) 存入列表
 - app.redis.lrange(键名, 起始位, 终止位) 读取列表
 - app.redis.set(键名, 值, 时间) 设置单一键值
 - app.redis.get(键名) 获取单一键值

## 2.9 Socket.IO
### 2.9.1 安装
```bash
$ yarn add egg-socket.io uws
```

### 2.9.2 启用与配置
>在plugin.js中启用Sequlize

```javascript
exports.io = {
  enable: true,
  package: 'egg-socket.io'
}
```
在config.{{env}}.js中配置数据库连接
```javascript
config.io = {
  init: {
    wsEngine: 'uws' // 使用uws
  },
  namespace: {
    '命名空间路径': {
      connectionMiddleware: ['中间件名称'], // 处理客户端连接与断开连接时的中间件
      packetMiddleware: ['中间件名称']      // 处理客户端发送信息到服务端时的中间件
    }
  },
  redis: {
    host: process.env.RS_HOST || 'Redis主机地址',
    port: process.env.RS_PORT || 'Redis主机端口号'
  }
}
```

### 2.9.3 文件格式
新建名为io的文件夹，并在其中分别建立两个文件夹controller和middleware，控制器和中间件的文件命名格式以及编码格式与eggjs的一样目录如下：
```
io
├── controller
└── middleware
```

### 2.9.4 Socket.IO路由配置
通过io.of设置命名空间，route()方法第一个参数是订阅的话题，第二个是使用的控制器
```javascript
app.io.of('/').route('new message', io.controller.chat.newMessage)
```

### 2.9.5 使用方法

1. 获取url参数
```javascript
const {参数} = this.socket.handshake.query
```
2. 加入房间
```javascript
this.ctx.socket.join('房间') // 加入房间
```
3. 获取客户端socketId
```javascript
this.ctx.socket.id
```
4. 获取当前房间所有客户端
```javascript
this.app.io.of('/').adapter.clients([房间], (err, clients) => {
})
```
5. 设置命名空间
```javascript
const nsp = this.app.io.of('/')
```
6. 推送数据

 - this.ctx.socket.emit('主题', '信息') // 只有发送者能看到
 - this.ctx.socket.broadcast('主题', '信息') // 只要发送者不能看到，其他人都能看到
 - this.app.io.emit('主题', '信息')   // 所有人都能看到
 - this.app.io.of('命名空间').to('房间').emit('主题', '信息') // 向该命名空间下该房间内所有客户端发送

## 2.10 参数校验
### 2.10.1 安装
```bash
$ yarn add egg-validate
```

### 2.10.2 启用
在plugin.js中启用validate

```javascript
exports.validate = {
  enable: true,
  package: 'egg-validate'
}
```

### 2.10.3 使用方法
validate有两个参数，第一个是需要校验的参数，另一个是需要校验的对象。
```javascript
const { user } = this.ctx.request.body
this.ctx.validate({
  username: { type: 'string', required: true },
  password: { type: 'string', required: true }
}, user)
```
## 2.11 模板渲染(选用nunjucks)

 - 模板文件默认目录在app/view中
 - EggJS结合模板文档：https://eggjs.org/zh-cn/core/view.html
 - 模板语法文档：http://mozilla.github.io/nunjucks/templating.

### 2.11.1 安装
```bash
$ yarn add egg-view-nunjucks
```

### 2.11.2 启用与配置
在plugin.js中启用nunjucks
```javascript
exports.nunjucks = {
  enable: true,
  package: 'egg-view-nunjucks'
}
```
在config.default.js中配置渲染引擎

1. 对指定后缀文件使用模板引擎渲染
```javascript
config.view = {
  mapping: {
    '.nj':'nunjucks'
  }
}
```
2. 渲染时无需写文件后缀
```javascript
config.view = {
  defaultExtension: '.nj'
}
```

### 2.11.3 使用方法
Context对象存在三个接口使用模板引擎，使用renderString时需要指定模板引擎，如果定义了defaultViewEngine这里可以省略：

 - render(name, locals) 渲染模板文件，并赋值给ctx.body
 - renderView(name, locals) 渲染模板文件，仅返回不赋值
 - renderString(tpl, locals) 渲染模板字符串，仅返回不赋值

例子：

1. controller/home.js
```javascript  
async test() {
  const ctx = this.ctx
  await ctx.render('index',{data:[
    {id: 1, name: "test"},
    {id: 2, name: "test"},
    {id: 3, name: "test"},
    {id: 4, name: "test"},
    {id: 5, name: "test"}
  ]})
}
```
2. router.js
```javascript
router.get('/', controller.home.test);
```

3. view/index.nj
```html
<div class="wrap">
  <button class="btn btn-warning">test</button>
  {% for item in data %}
  <div>{{item.name}}</div>
  {% endfor%}
</div>
```

### 2.11.4 静态文件

1. 到config.js中开启static，默认是注释掉的，egg-static属于内置插件
```javascript
exports.static = true;
```
2. 静态文件存放路径：app/public
3. 引用方式

 - 外部查看  
http://localhost:7001/public/文件名.后缀
 - 模板调用
public/+文件在public文件夹下的路径

## 2.12 Git规范
### 2.12.1 分支类型
feature
 - 功能开发分支
bugfix
 - 问题修复分支
develop
 - 在项目没有经过测试并达到生产环境前，全部合并到dev分支，开发新功能也从dev分支迁出
master
 - 生产环境版本
### 2.12.2 分支命名
基本格式（全为英文）
 - feature/功能名称
 - bugfix/bug名称

例子：

 - feature/user
 - bugfix/login_error

### 2.12.3 开发流程
master 迁出develop分支 -> develop分支迁出feature功能分支 -> 提交pr审查代码 -> 提交QA -> 合并到develop -> 合并到master
### 2.12.4 提交格式
使用git cz代替git commit 
插件地址：https://github.com/commitizen/cz-cli
1. 安装
```bash
$ npm install -g commitizen
```
2. 在项目中运行下面命令,使其支持 Angular 的 Commit message 格式
```bash
$ commitizen init cz-conventional-changelog --save --save-exact
```
3. 使用
```bash
$ git add .
$ git cz
```
4. 格式的选择

 - feat:     新功能提交
 - fix:      修复一个bug
 - docs:     只修改了文档
 - style:    修改一些不会影响代码含义的东西（空格，格式化，分号等等）
 - refactor: 代码更改既不修复错误也不添加功能
 - perf:     代码更改提高了性能
 - test:     添加缺少的测试或更正现有的测试
 - build:    影响构建系统的更改或外部依赖关系的更改 (例如: gulp, broccoli, npm)
 - ci:       改变测试配置文件和脚本(例如: T
 - ravis, Circle, BrowserStack, SauceLabs)
 - chore:    没有更改 `src` 或者 `test` 文件的更改
 - revert:   恢复之前的提交

5. 详细问题
记录修改的文件名? 

- What is the scope of this change (e.g. component or file name)? (press enter t
o skip)
简短的说明? 
 - Write a short, imperative tense description of the change:
长说明（可不写）? 
 - Provide a longer description of the change: (press enter to skip)
是否用破坏性修改?
 - Are there any breaking changes? 
修改是否影响到一些开启的issues（可不写）? 
 - Does this change affect any open issues? 

## 2.13 接口自测
### 2.13.1 软件

 - 名称：postman
 - 下载地址：https://www.getpostman.com/

### 2.13.2 操作规范
对负责的模块单独建立文件夹，将接口存放进去。将接口请求后的数据格式与约定返回的数据格式做对比。
# 3.RESTful API规范
## 3.1 请求协议

 - http
 - https

## 3.2 请求方法
|请求方法	|功能|
| -|-|
|GET |	获取资源 |
|POST |	新增资源 |
|PUT |	更新整个资源 |
|PATCH |	更新个别资源 |
|DELETE |	删除资源 |

## 3.3 状态码
### 3.3.1 成功状态码
|状态码	| 定义 |
| -|-|
|200|	请求成功。客户端向服务器请求数据，服务器返回相关数据|
|201| 资源创建成功。客户端向服务器提供数据，服务器创建资源|
|202|	请求被接收。但处理尚未完成|
|204|	客户端告知服务器删除一个资源，服务器移除它|
### 3.3.2 错误状态码
|状态码|错误描述|
| -|-|
|400|	请求无效。数据不正确，请重试|
|401|	请求没有权限。缺少API token，无效或者超时|
|403|	请求未被授权。当前权限无法获取指定的资源|
|404|	请求失败。请求资源不存在|
|406|	请求失败。请求头部不一致，请重试|
|422|	请求失败。请验证参数|

### 3.3.3 服务器错误状态码
|状态码|	定义|
| -|-|
|500|	服务器发生错误，请检查服务器|
|502|	网关错误|
|503|	服务不可用，服务器暂时过载或维护|
|504|	网关超时|
### 3.3.4 自定义状态码
具体而定
## 3.4 版本号

 - 通过版本号可以区分api的版本
 - 通过/api/v1/*代表v1版本
 - 通过/api/v2/*代表v2版本

## 3.5 URL规范
RESTful API的所有操作都是针对特定资源进行的。资源就是URL所表示的，URL需要符合以下规范：

 - 只能是名词不能是动词
 - 小写字符
 - 不可使用下划线'_'，可以使用连字符'-'
 - CRUD不可出现在URL中
 - 参数列表要用encode
 - 避免层级过深的URI，尽量使用查询参数代替路径中的实体导航，如GET /user?sex=female&age=30

具体形式如下：
1. /api/{资源名}/{描述名}
2. /api/{资源名}/{对象id}/{描述名}
例子：

 - GET http://www.demo.com/api/v1/user/1 获取用户1的信息
 - POST http://www.demo.com/api/v1/user/login 登录
 - PUT http://www.demo.com/api/v1/user/1 更新用户1的全部信息
 - DELETE http://www.demo.com/api/v1/user/1 删除用户1
 - PATCH http://www.demo.com/api/v1/user/1 更新用户1部分信息
 - GET http://www.demo.com/api/v1/user/1/role 获取用户1的权限信息

## 3.6 请求体格式
```javascript
{
  "data": {
    "键":"值"
  }
}
```
例子：
```javascript
{
  "data": {
    "username":"klren",
    "password":"123456"
  }
}
```
## 3.7 返回体格式
正常返回
```javascript
{
  "code": "状态码",
  "msg":"状态描述",
  "data":"具体内容"
}
```
例子：
```javascript
{
  "code": 200,
  "msg": "success",
  "data": {
    "username": "klren",
    "email":"klren@qq.com"
  }
}
```
错误返回
```javascript
{
  "code": "错误状态码",
  "msg": "错误信息",
  "data": {
    "error": "错误详情",
  }
}
```
例子：
```javascript
{
  "code": "400",
  "msg": "数据格式错误",
  "data": {
    "error": "格式错误"
  }
}
```
## 3.8 过滤、分页与排序
采用'?'符号进行这些操作
## 3.8.1 过滤
使用唯一的查询参数进行过滤
例子：

 - GET /user?id=1 返回id等于1的用户
 
### 3.8.2 排序
使用sort,后面跟着键名和排序方式
例子：

 - GET /user?sort=age,desc 查询用户根据年龄倒序

### 3.8.4 分页
使用limit和offset,后面跟具体数字。limit后面跟每页最多数据量，offset后面跟数据起始位。
请求例子：

 - GET /user?limit=10&offset=0 获取从第0位开始的10个用户数据
返回体例子：
```javascript
{
  "code":200,
  "message":'success',
  "data":{
    "total": 0,
    "pageIndex": 1,
    "pageSize": 10,
    "list":[{},{},{}...]
  }
}
```

## 3.9 请求格式

 - Content-Type:application/json 数据发送
 - Content-Type:multipart/form-data 文件上传
