# kBlog-Express
一个基于Express框架的个人博客系统


### 主要模块

```js
express              // 基础web框架
log4js               // 日志模块
nodemailer           // 发送邮件模块
connect-busboy       // 上传模块
mongoose             // MongoDB的ORM模块
swig                 // html模版引擎
passport             // 帐号认证模块
markdown-it          // Markdown解析模块
lodash               // 工具库
moment               // 日期处理模块
validator            // 数据验证模块
node-schedule        // 定时任务模块
```

### 目录结构

```js
- assets              // 静态资源
  + image             // 图片资源
  + sass              // sass预编译文件
+ frontend            // 前端js代码
+ libs                // 公用函数
+ logger              // 日志文件
- public              // 编译后的静态文件
  + css               // 样式表文件
  + img               // 样式表图片
- server              // 服务端代码
  + api               // API接口
  + common            // 服务端公共函数
  + controller        // 控制器
  + middlewares       // 自定义中间件
  + models            // 数据库模型
  + polices           // 过滤器
  + proxy             // 业务逻辑层
  + router            // 路由层
  app.js              // 入口文件
+ views               // html模版
```

### Usage

安装：
```bash
$ git clone https://thondery@github.com/thondery/kblog-express.git
$ cd kblog-express && npm install
```

编译：
```bash
$ npm run build
```

初始化：
```bash
$ npm run init
```

运行：
```bash
$ npm sun start
```

### License

The MIT License (MIT).