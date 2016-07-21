#!/usr/bin/env node
'use strict';

import gulp from 'gulp'
import gulpLoadPlugins from 'gulp-load-plugins'
import sequence from 'run-sequence'
import del from 'del'
import path from 'path'
import pngquant from 'imagemin-pngquant'
import { existsSync, readFileSync, unlink, writeFileSync } from 'fs'
import compile from './webpack.config'
import { watchHandle } from './libs/gulp-extend'

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
  runSequence('clean', ['compile', 'compile-html', 'picture'], ['devServer'], ['watch'])
)

gulp.task('watch', () => {
  $.watch([
      './assets/jsapi/*.api', 
      './views/**/*.+(html|htm)'
    ], e => watchHandle(e, {
      assets: './views',
      dist: './public/html'
    }, 'compile-html'))
  $.watch([
      './assets/sass/**/*.scss', 
      './assets/image/**/*.+(pg|gif|png|svg)', 
      './frontend/**/*.+(js|jsx|es6)'
    ], e => watchHandle(e, {
      assets: './assets',
      dist: './public'
    }, 'compile'))
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

const getAPIData = file => {
  let jsAPI = path.basename(file.path).replace(/\.(html|htm)$/i, '.api')
  let data = JSON.parse(readFileSync('./assets/jsapi/' + jsAPI, 'utf-8') || '{}')
  let auth = JSON.parse(readFileSync('./assets/jsapi/auth.api', 'utf-8') || '{}')
  let link = JSON.parse(readFileSync('./assets/jsapi/link.api', 'utf-8') || '{}')
  return auth.state ? Object.assign(data, { 
    auth: auth.user, 
    link: link 
  }) : Object.assign(data, { 
    link: link 
  })
}