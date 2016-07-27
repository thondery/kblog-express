'use strict';

import $ from 'jquery'
import moment from 'moment'
import IScroll from 'iscroll/build/iscroll-probe.js'
import win from './init-window'
import request from 'superagent'

let [myScroll, ltr_time, pullUpFlag, pullDownFlag, loadingDom, moreDom] = [
  ,
  moment().format('x'),
  0,
  0,
  '<div class=\"loading\"><i class=\"fa fa-refresh fa-spin fa-1x\" aria-hidden=\"true\"><\/i> 正在加载中 ...<\/div>',
  '<div class=\"load-more\"><button type=\"button\" class=\"btn btn-info btn-lg\" data-loading-text=\"Loading...\">点击查看更多<\/button><\/div>'
]

const scrollRefresh = () => {
  if (win.IsMobile) {
    mobileScroll()
  }
  else {
    $('.list-container .list-group').after(moreDom)
    $('.list-container .load-more .btn').on('click', loadMoreHandle)
  }
}

const loadMoreHandle = e => {
  let $btn = $(e.target).button('loading')
  getIndexlist(false, () => {
    $btn.button('reset')
  })
  
}

const mobileScroll = () => {
  $('.bodyer-wrap .body-inner').css('overflow', 'hidden')
  $('.list-container .list-group').before(loadingDom).after(loadingDom)
  myScroll = new IScroll('.body-inner', { 
    probeType: 2,
    //momentum: true, // 关闭惯性滑动
    scrollbars: true, // 滚动条可见
    mouseWheel: true, // 鼠标滚轮开启
    //interactiveScrollbars: true, // 滚动条可拖动
    fadeScrollbars: true, // 滚动条渐隐
    click: true, // 屏幕可点击
    //shrinkScrollbars: 'scale', // 当滚动边界之外的滚动条是由少量的收缩
    //useTransform: true, // CSS转化
    //useTransition: true, // CSS过渡
    //bounce: true, // 反弹
    //freeScroll: false, // 只能在一个方向上滑
    //snap: 'li'
  })
  myScroll.on('scrollEnd', scrollEndHandle)
  myScroll.on('scroll', scrollHandle)
  document.addEventListener('touchmove', e => e.preventDefault(), false)
}

const scrollHandle = () => {
  // 判断上拉
  if (myScroll.maxScrollY-80 >= myScroll.y) {
    pullUpFlag = 1
  }
  // 判断下拉
  if (myScroll.y >= 80) {
    pullDownFlag = 1
  }
}

const scrollEndHandle = () => {
  let _ltr_time = moment().format('x')
  if (_ltr_time - ltr_time <= 5000) {
    pullUpFlag = pullDownFlag = 0
    return false
  }
  // 上拉操作
  if (pullUpFlag === 1) {
    $('.list-container .loading:last').show()
    myScroll.refresh()
    myScroll.scrollBy(0, -40)
    ltr_time = _ltr_time
    pullUpFlag = 0
    
    // 发送请求
    getIndexlist(false, () => {
      $('.list-container .loading').hide()
      myScroll.refresh()
    })
  }
  // 下拉操作
  if (pullDownFlag === 1) {
    $('.list-container .loading:first').show()
    myScroll.refresh()
    ltr_time = _ltr_time
    pullDownFlag = 0
    // 发送请求
    getIndexlist(true, () => {
      $('.list-container .loading').hide()
      myScroll.refresh()
    })
  }
}

const getIndexlist = (start, done) => {
  let limit = $('.list-container .list-group>.list-group-item').length
  console.log('limit: %d', start ? 0 : limit)
  setTimeout(() => done(), 3000)
  /*request.get('/api/post')
    .query({ limit: start ? 0 : limit })
    .set('Accept', 'application/json')
    .end( function(err, res) {

    })*/
}

export default {
  scrollRefresh
}