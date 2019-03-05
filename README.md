# ironInfoWeapp
钢材信息小程序

# 技术选型
![](https://upload-images.jianshu.io/upload_images/2245742-aa8925cdb8e05969.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/579/format/webp)

# 整体看板
https://trello.com/b/5EvkpRSQ/%E6%B2%BB%E7%94%B5%E7%A7%91%E6%8A%80%E5%8D%81%E5%B9%B4%E8%A7%84%E5%88%92

# 使用的第三方库

 - Echarts
 - mpvue-echarts
 - marked (md => html)
 - mpvue-wxparse (html => wxml)

# 目录介绍
```
├─common
├─components // 组件
│  ├─echarts
│  ├─marked
│  ├─mpvue-echarts
│  └─mpvue-wxparse
├─img // Readme用的图片文件夹
├─pages // 页面
│  ├─article // 文章页
│  ├─details // 钢材详情页
│  ├─home // 首页
│  ├─index // 钢材搜索页
│  ├─iron // 钢材信息页
│  └─search // 钢材搜索框
├─static // tabbar图片
└─store // vuex文件
```

# 小程序码
![](./img/weapp.png)

# changelog

 - 18.10.05 项目初始化, 首页插入ECharts图表
 - 18.12.02 项目第一版完成, 功能(搜索钢材, 钢材历史价格图表, 钢材详情)
 - 18.12.08 搜索修改, 添加联想和历史搜索
 - 18.12.19 首页回归, 热门钢材九宫格, 文章列表
 - 18.12.24 对接文章接口
 - 19.01.13 精简文件

# 界面截图

 - 第三版,添加首页
---
![](./img/3.png)
 - 第二版, 修改样式和添加联想搜索
---
![](./img/2.png)
 - 第一版
---
![](./img/1.png)
