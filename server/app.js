'use strict';

import config from './config'
import express from 'express'
import log4js from 'log4js'
import path from 'path'
import swig from 'swig'
import bodyParser from 'body-parser'
import methodOverride from 'method-override'
import cookieParser from 'cookie-parser'
import session from 'express-session'
import connectRedis from 'connect-redis'
import compress from 'compression'
import passport from 'passport'
import passportLocal from 'passport-local'
import _ from 'lodash'
import errorhandler from 'errorhandler'
import URL from 'url'
import cors from 'cors'
import busboy from 'connect-busboy'
import bytes from 'bytes'
import moment from 'moment'

import logger from './common/logger'
import './middlewares/mongoose_log' // 打印 mongodb 查询日志
import { webRouter, apiRouter } from './router'

const [app, RedisStore, LocalStrategy, staticDir, urlInfo] = [
  express(),
  connectRedis(session),
  passportLocal.Strategy,
  path.join(process.cwd(), 'public'),
  URL.parse(config.host)
]
config.hostname = urlInfo.hostname || config.host

// logger
app.use(log4js.connectLogger(logger, {
  level: config.logger.level,
  format: config.logger.format
}))

// views
app.set('views', path.join(process.cwd(), 'views'))
app.set('view engine', 'html')
app.engine('.html', swig.renderFile)
app.set('view cache', false)
swig.setDefaults({ cache: false })

// method override
app.use(bodyParser.json({ limit: '1mb' }))
app.use(bodyParser.urlencoded({ extended: true, limit: '1mb' }))
app.use(methodOverride())

// cookie
app.use(cookieParser(config.session_secret))

// session
app.use(session({
  secret: config.session_secret,
  store: new RedisStore({
    port: config.redis_port,
    host: config.redis_host,
    pass: config.redis_pass || ''
  }),
  resave: true,
  saveUninitialized: true
}))

// compress
app.use(compress())

// oauth
app.use(passport.initialize())
app.use(passport.session())

passport.serializeUser( (user, done) => 
  done(null, user)
)
passport.deserializeUser( (user, done) => 
  done(null, user)
)

// set static, dynamic helpers
_.extend(app.locals, {
  config: config,
  //tools: Tools,
  moment: moment,
  _: _
})

// 上传设置
app.use(busboy({
  limits: {
    fileSize: bytes(config.file_limit)
  }
}))

// static
app.use(express.static(staticDir))

// routers
app.use('/', webRouter)
app.use('/api', cors(), apiRouter)

// 404
app.use('*', (req, res) => {
  logger.error('status:404; url:', req.originalUrl)
  return res.status(404).send('404 not page')
})

// error handler
if (config.debug) {
  app.use(errorhandler())
}
else {
  app.use( (err, req, res, next) => {
    logger.error('server 500 error: ', err)
    return res.status(500).send('500 status')
  })
}

// run app
if (!module.parent) {
  app.listen(config.port, config.hostname, () => {
    logger.info('kBlog listening on port', config.port)
    logger.info('God bless love....')
    logger.info('You can debug your app with http://' + config.hostname + ':' + config.port)
    logger.info('')
  })
}

export default app



