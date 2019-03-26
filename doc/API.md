# 铜陵钢材信息API文档

## 1. 用户相关

#### 用户注册
POST  /useregister

#### 用户登录
POST /userogin

#### 获取用户列表
GET /user 

#### 更新用户信息
PUT /user 

#### 删除用户信息
DELETE /user 

#### 获取用户日志
GET /log 

#### 发送重置邮件
POST /email 

#### 重置密码
POST /reset 

#### 获取微信小程序用户
GET /wuser 

---

## 2. 钢材相关

#### 添加钢材信息
POST /iron  

#### 获取钢材列表
GET /iron 

#### 获取全部钢材信息
GET /iron/all

#### 更新钢材信息
patch /iron  

#### 删除钢材信息
DELETE /iron  

#### 更新钢材价格
POST /ironrice 

---

## 3. 热门钢材相关

#### 添加热门钢材信息
POST /hot 

#### 获取热门钢材列表
GET /hot 

#### 更新热门钢材信息
patch /hot  

#### 删除热门钢材信息
DELETE /hot  

#### 热门钢材排序
PUT /hot 

---

## 4. 首页展示相关

#### 获取微信token
GET /token 

#### 获取用户画像
GET /wechatUser 

---

## 5. 文章相关

#### 获取文章, 钢材统计数据
GET /homeSum 

#### 添加文章
POST /article 

#### 删除文章
DELETE /article 

#### 文章列表
GET /article 

#### 更新文章
PUT /article 

#### 修改文章状态
patch /article 

---

## 6. 小程序上相关

#### 获取全部钢材信息
GET /weappron/all

#### 通过钢材名称查询
GET /weappron

#### 获取钢材选择
GET /weappron/option

#### 获取文章列表
GET /weapprticle

#### 获取热门钢材信息
GET /weappot

#### 小程序登录
POST /weappogin

#### 获取新闻
POST /weappews

#### 获取天气
GET /weappeather
