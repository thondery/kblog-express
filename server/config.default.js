'use strict';

export default {

  // 调试模式
  debug: true,

  name: 'kBlog',

  host: 'localhost',

  // 服务端口
  port: 3001,

  // Session 
  session_secret: 'kblog_secret',

  // Redis
  redis_host: '127.0.0.1',
  redis_port: 6379,

  // MongoDB
  mongo_uri: 'mongodb://localhost:27017/kblog',
  mongo_perfix: 'kb_',

  // 日志
  logger: {
    filename: 'access.log',
    maxlogsize: 500,
    category: 'kBlog',
    format: ':method :url :status',
    level: 'auto'
  },
  
}