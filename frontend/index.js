'use strict';

import 'bootstrap/dist/css/bootstrap.css'
import 'font-awesome/css/font-awesome.css'
import '../assets/sass/index.scss'

import $ from 'jquery'
import win from './common/init-window'
import listContainer from './common/list-container'

$(() => {
  win.Init()
  listContainer.scrollRefresh()

  

})