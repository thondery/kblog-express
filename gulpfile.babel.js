#!/usr/bin/env node
'use strict';

import gulp from 'gulp'
import gulpLoadPlugins from 'gulp-load-plugins'
import sequence from 'run-sequence'
import del from 'del'
import path from 'path'
import pngquant from 'imagemin-pngquant'
import { readFileSync, readdirSync, writeFileSync, existsSync, mkdirSync, statSync } from 'fs'
import compile from './webpack.config'
import { watchHandle } from './libs/gulp-extend'
import tools from './libs/tools'
import moment from 'moment'
import jsapi from './assets/jsapi/data'
import _ from 'lodash'
import mkdirp from 'mkdirp'
import gmUtil from './server/common/gmutil'
import gutil from 'gulp-util'
import chalk from 'chalk'
import prettyTime from 'pretty-hrtime'
import jsonsql from 'jsonsql'

const [$, runSequence] = [
  gulpLoadPlugins(),
  sequence.use(gulp)
]


gulp.task('clean', () =>
  del.sync('./public', { dot: true })
)

gulp.task('picture', () => 
  gulp.src(['./assets/picture/**/*.+(png|jpg|gif|svg)'])
    .pipe($.imagemin({
      progressive: true,
      interlaced: true,
      svgoPlugins: [{removeViewBox: false}],
      optimizationLevel: 5,
      use: [pngquant()]
    }))
    .pipe(gulp.dest('./public/picture'))
)

gulp.task('thumb', () => {
  let docs = readdirSync('./assets/markdown')
  return docs.map( item => {
    let doc = readFileSync('./assets/markdown/' + item, 'utf-8')
    let img = tools.firstImg(doc, 0)
    if (img) {
      let file = path.join(__dirname, './assets/markdown', img)
      if (existsSync(file)) {
        let start = process.hrtime()
        gmUtil.thumbnail(file, { width: 300, height: 300, path: './public' }, err => {
          let end = process.hrtime(start)
          let time = prettyTime(end)
          if (err) {
            gutil.log(
              '\'' + chalk.cyan('thumb => ' + tools.thumbnail(file)) + '\'',
              chalk.red('errored after'),
              chalk.magenta(time)
            )
            return gutil.log(err.message)
          }
          gutil.log(
            'Finished', '\'' + chalk.cyan('thumb => ' + tools.thumbnail(file)) + '\'',
            'after', chalk.magenta(time)
          )
        })
      }
    }
  })
})

gulp.task('compile', () => 
  gulp.src('./frontend/index.js')
    .pipe($.webpack(compile))
    .pipe(gulp.dest('./public'))
)

gulp.task('build', () =>
  runSequence('clean', ['compile', 'picture'])
)

gulp.task('compile-html', () =>
  gulp.src(['./views/*.html'])
    .pipe($.data(getAPIData))
    .pipe($.swig({ defaults: { cache: false } }))
    .pipe(gulp.dest('./public/html'))
)

gulp.task('dev', () =>
  runSequence('clean', ['thumb', 'jsapi'], ['compile', 'compile-html', 'picture'], ['devServer'], ['watch'])
)

gulp.task('watch', () => {
  $.watch([
      './assets/jsapi/*.api',
      './public/jsapi/*.api', 
      './views/**/*.+(html|htm)'
    ], e => watchHandle(e, null, 'compile-html'))
  $.watch([
      './assets/sass/**/*.scss', 
      './assets/image/**/*.+(jpg|gif|png|svg)', 
      './frontend/**/*.+(js|jsx|es6)'
    ], e => watchHandle(e, null, 'compile'))
  $.watch([
    './assets/markdown/*.+(md|markdown)',
    './assets/picture/*.+(jpg|gif|png|svg)'
  ], e => watchHandle(e, null, 'redata'))
})

gulp.task('redata', () => {
  runSequence('data', ['thumb', 'jsapi'])
})

gulp.task('devServer', () =>
  gulp.src('./public')
      .pipe($.webserver({
        host: 'localhost',
        port: 8081,
        fallback: 'index.html',
        livereload: true,
        directoryListing: false,
        open: false
      }))
)

gulp.task('data', () => {
  let docs = readdirSync('./assets/markdown')
  let data = []
  return docs.map( (item, i) => {
    let doc = readFileSync('./assets/markdown/' + item, 'utf-8')
    let stat = statSync('./assets/markdown/' + item)
    data.push(tools.postInfo(doc, ['_id', 'titlename', 'content', 'tags', 'update_at'], {
      update_at: stat.mtime
    }))
    if (i === docs.length - 1) {
      writeFileSync('./assets/data.json', JSON.stringify(data, null, 2))
    }
  })
})

gulp.task('jsapi', () => {
  let data = JSON.parse(readFileSync('./assets/data.json', 'utf-8') || '[]')
  data = _.orderBy(data, ['update_at'], ['desc'])
  mkdirp('./public/jsapi', '0755', err => {
    if (err) throw err
    jsapi.map( (item, n) => {
      let obj = JSON.parse(readFileSync('./assets/jsapi/' + item.name + '.api', 'utf-8') || '{}')
      if (item.length) {
        obj[item.key] = _.slice(data, item.start, item.length)
      } else {
        //obj[item.key] = _.find(data, item.find)
        let _list = jsonsql(data, '* where ' + item.find)
        obj[item.key] = _list.length > 0 ? _list[0] : undefined
      }
      writeFileSync('./public/jsapi/' + item.name + '.api', JSON.stringify(obj, null, 2))
    })
  })
})

const getAPIData = file => {
  let jsAPI = path.basename(file.path).replace(/\.(html|htm)$/i, '.api')
  let data = JSON.parse(readFileSync('./public/jsapi/' + jsAPI, 'utf-8') || '{}')
  let auth = JSON.parse(readFileSync('./assets/jsapi/auth.api', 'utf-8') || '{}')
  let link = JSON.parse(readFileSync('./assets/jsapi/link.api', 'utf-8') || '{}')
  data = Object.assign(data, { link: link, tools: tools, moment: moment, debug: true })
  return auth.state ? Object.assign(data, { auth: auth.user }) : data
}