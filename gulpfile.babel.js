#!/usr/bin/env node
'use strict';

import gulp from 'gulp'
import gulpLoadPlugins from 'gulp-load-plugins'
import sequence from 'run-sequence'
import del from 'del'
import compile from './webpack.config'

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