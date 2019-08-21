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

## 数据库每日定时备份方法
### 1.mailx
mailx是Linux系统上用来处理邮件的工具,使用它可以发送,读取邮件
使用以下命令安装（发现好像系统自带了）
```
yum -y install mailx
```
![TIM截图20171129171545.png](http://upload-images.jianshu.io/upload_images/2245742-4cc3b24f3f3eac33.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

### 2.步骤
1）配置发送邮箱
>由于要发送，肯定要用的邮箱账户，我使用的139邮箱，我就看他天天发话费通知什么的好烦，不用难受。。。

进入mail.rc进行配置
```
vi /etc/mail.rc
```
在其最下面加几句配置（stmp服务器自己查自己用到的邮箱）
>注意别带上写代码的习惯, 等于号后别加空格...

```
set from=自己写@139.com
set smtp=smtps://smtp.139.com:465
set smtp-auth=login
set smtp-auth-user=自己写@139.com
set smtp-auth-password=自己写 
set ssl-verify=ignore
set nss-config-dir=/etc/pki/nssdb/
```
2）配置证书(**注意：**上面配置的`nss-config-dir`就是存放证书的路径，可自定义）
```
$ echo -n | openssl s_client -connect smtp.139.com:465 | sed -ne '/-BEGIN CERTIFICATE-/,/-END CERTIFICATE-/p' > /etc/pki/nssdb/139.crt
$ certutil -A -n "GeoTrust SSL CA" -t "C,," -d /etc/pki/nssdb/ -i /etc/pki/nssdb/139.crt
$ certutil -A -n "GeoTrust Global CA" -t "C,," -d /etc/pki/nssdb/ -i /etc/pki/nssdb/139.crt
$ certutil -L -d /etc/pki/nssdb/
```
进入`/etc/pki/nssdb`,即可看到生成的证书
![TIM截图20171129171304.png](http://upload-images.jianshu.io/upload_images/2245742-24a1d29453c1be0a.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

3）发送邮件
使用以下命令发送
```
echo "内容" | mail -v -s "标题"  接受邮件的邮箱
```
![TIM截图20171129171407.png](http://upload-images.jianshu.io/upload_images/2245742-4bd629c946267a9c.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
![TIM截图20171129165639.png](http://upload-images.jianshu.io/upload_images/2245742-a3ae1162b54b36a0.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

### 3.数据库备份命令
#### 1.备份单个数据库
备份名为zzes的数据库
```
mysqldump -u root -proot zzes>zzes.sql
```
**这样干,在高版本mysql下会报个warn**
所以可以使用下面方法
```
$ vi /etc/my.cnf
```
在里面填入你的用户名密码, 填入内容如下
```
[mysqldump]
user=your_backup_user_name
password=your_backup_password
```
保存,再用这个命令,即可导出
```
mysqldump --defaults-extra-file=/etc/my.cnf  你的数据库名称>文件名.sql
```

#### 2.备份多个数据库
备份名为zzes1和zzes2的数据库
```
mysqldump -u root -proot --databases zzes1 zzes2 > zzes1_zzes2.sql
```

#### 3.备份全部数据库
```
# mysqldump -u root -proot --all-databases > all-databases.sql
```

#### 4.只备份数据库结构
```
mysqldump -u root -proot --no-data zzes> zzes_structure.sql
```
#### 5.只备份数据库的数据
```
mysqldump -u root -proot --no-create-db --no-create-info zzes > zzes_data.sql
```

### 4.脚本
```
#/bin/bash
mysqldump -u root -proot --all-databbases > all-databases.sql
mail -v -s "治电天机数据库日常备份" -a all-databases.sql renzw@zzes1314.cn < content.txt
```

 - 第一句：删除原来的备份文件
 - 第二句：备份整体数据库
 - 第三句：将数据库备份文件发送到指定邮箱

![图片.png](http://upload-images.jianshu.io/upload_images/2245742-17c63e9b566a0aa2.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

### 5.定时运行脚本
>http://linuxtools-rst.readthedocs.io/zh_CN/latest/tool/crontab.html
https://www.jianshu.com/p/838db0269fd0

![图片.png](http://upload-images.jianshu.io/upload_images/2245742-6da133310119b4b6.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

创建一个文件，比如
```
touch zzes
```
进入编辑
```
vim zzes
```
输入（每分钟一次测试用）
```
* * * * * /bin/sh ~/test.sh
```
运行
```
crontab zzes
```
**注意：**用了定时，所有的路径，都要用全局的比如 `sh`命令要用`/bin/sh`
