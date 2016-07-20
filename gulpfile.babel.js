#!/usr/bin/env node
'use strict';

import gulp from 'gulp'
import gulpLoadPlugins from 'gulp-load-plugins'
import sequence from 'run-sequence'
import del from 'del'
import path from 'path'
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

gulp.task('compile', () => 
  gulp.src('./frontend/index.js')
    .pipe($.webpack(compile))
    .pipe(gulp.dest('./public'))
)

gulp.task('build', () =>
  runSequence('clean', ['compile'])
)

gulp.task('compile-html', () =>
  gulp.src(['./views/*.html'])
    .pipe($.data(getAPIData))
    .pipe($.swig({ defaults: { cache: false } }))
    .pipe(gulp.dest('./public/html'))
)

gulp.task('dev', () =>
  runSequence('clean', ['compile', 'compile-html'], ['devServer'], ['watch'])
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
  let data = readFileSync('./assets/jsapi/' + jsAPI, 'utf-8')
  return JSON.parse(data || '{}')
}