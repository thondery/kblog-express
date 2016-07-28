'use strict';

import 'bootstrap/dist/css/bootstrap.css'
import 'font-awesome/css/font-awesome.css'
import 'highlight.js/styles/default.css'
import '../assets/sass/post.scss'

import $ from 'jquery'
import win from './common/init-window'
import postInner from './common/post-inner'

$(() => {
  win.Init()
  postInner.scrollRefresh()

})
