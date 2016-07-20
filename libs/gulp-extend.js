'use strict';

import gulp from 'gulp'
import sequence from 'run-sequence'
import path from 'path'
import gutil from 'gulp-util'
import chalk from 'chalk'
import prettyTime from 'pretty-hrtime'
import { unlink } from 'fs'

const [runSequence] = [
  sequence.use(gulp)
]

const watchHandle = (e, opts, task) => {
  if (e.event === 'change' || e.event === 'add') {
    return runSequence(task)
  }
  if (e.event === 'unlink') {
    let [_assets, _dist, start] = [
      path.join(process.cwd(), opts.assets || 'assets'),
      path.join(process.cwd(), opts.dist || 'dist'),
      process.hrtime()
    ]
    gutil.log('Starting', '\'' + chalk.cyan(task) + '\'...')
    unlink(e.history[0].replace(_assets, _dist), err => {
      let end = process.hrtime(start)
      let time = prettyTime(end)
      if (err) {
        gutil.log(
          '\'' + chalk.cyan(task) + '\'',
          chalk.red('errored after'),
          chalk.magenta(time)
        )
        return gutil.log(err.message)
      }
      gutil.log(
        'Finished', '\'' + chalk.cyan(task) + '\'',
        'after', chalk.magenta(time)
      )
    })
  }
}

export {
  watchHandle
}