# 普钢管理后台API服务

## 使用库

 - EggJS
 - MySQL
 - Redis

## 运行
```bash
$ npm install  /   yarn
$ npm run dev  /   yarn dev
```

## 配置文件
`config\config.default.js`

## 数据库初始化
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

## 部署
```bash
$ npm run start /  yarn start
```


